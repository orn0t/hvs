"use strict";

let Card  = require('./models/card.js');
let User = require('./models/user.js');
let Mission = require('./models/mission.js');

let apiRouter = require('./api.js');
let handlers = require('./WorkWithDB.js');

module.exports = (app, passport) => {

    app.use('/api', apiRouter(passport));

    app.all('*', function(req, res, next) {
        if(req.user) {
            app.locals.you = req.user;
        }

        return next();
    });


    app.get('/card/:number', (req, res) => {
        Card.findOne({number: req.params.number}, (err, card) => {
            if(err) {
                res.status(500).json({error: err})
            }

            if(card) {
                res.json(card)
            } else {
                res.status(404).json({error: 'Not found'})
            }
        })
    });

    app.get('/', authMiddleware, (req, res) => {
        res.redirect('/profile');
    });


    app.get('/welcome', (req, res) => {
        res.render('welcome.ejs');
    });

    app.get('/profile', authMiddleware, (req, res) => {

        let context = {
            missions: []
        };

        Mission.find({}).exec().then((missions) => {
            context.missions = missions;
            res.render('profile.ejs', context)
        }).catch((err) => {
            res.status(500).json({error: err})
        });
    });

    // Facebook authentication
    app.get('/auth/fb', passport.authenticate('facebook', {scope: ['email']}));
    app.get('/auth/fb/callback', (req, res, next) => {
        return passport.authenticate('facebook', {
            successRedirect: req.session.returnTo || '/profile',
            failureRedirect: '/welcome'
        })(req, res, next);
    });

    app.get('/auth/logout', function(req, res) {
        req.logout();
        res.redirect('/welcome');
    });

    app.all('/manager/*', authMiddleware, (req, res, next) => {
        if(req.user.is_manager) {
            return next();
        }

        res.status(403).json({error: 'Only managers accepted'})
    });

    app.get('/manager/users', (req, res) => {
        User.find({}, (err, users) => {
            if (err) {
                res.code(500).json({error: err})
            }

            res.render('manager/users.ejs', {
                users: users
            });
        });
    });

    app.get('/mission', (req, res) => {

        let context = {
            missions: []
        };
        
        Mission.find({}).exec().then((missions) => {
            context.missions = missions;

            res.render('mission.ejs', context);
        }).catch((err) => {
            res.status(500).json({error: err})
        });
    });

    app.get('/manager/new_mission', (req, res) => {
        res.render('manager/new_mission.ejs');
    });

    
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({extended: false});

   // let Mission = require('./models/mission');

    
    
    app.post('/manager/new_mission', urlencodedParser, handlers.formHandler);

    //POST запрос для создания новой миссии
    /*app.post('/manager/new_mission', urlencodedParser, function(req, res) {
        
        let newMission = new Mission({
            title: req.body.title,
            teaser: req.body.teaser,
            description: req.body.description,
            telegram_chat: req.body.telegram_chat,
            date_from: req.body.date_from,
            date_to: req.body.date_to,
            time: req.body.time,
            city: req.body.city,
            max_participants: req.body.max_participants,
            active: is_active
        });
        
        newMission.save();

        res.redirect('/profile');

        //res.render('testejs.ejs', {qs: req.body});
    });
    //*/

};

function authMiddleware(req, res, next) {

    if (req.isAuthenticated())
        return next();

    req.session.returnTo = req.url;
    res.redirect('/welcome');
}
