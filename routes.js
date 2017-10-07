"use strict";

let Card  = require('./models/card.js');
let User = require('./models/user.js');
let Mission = require('./models/mission.js');

module.exports = (app, passport) => {
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
};

function authMiddleware(req, res, next) {

    if (req.isAuthenticated())
        return next();

    req.session.returnTo = req.url;
    res.redirect('/welcome');
}
