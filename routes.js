"use strict";

let Card  = require('./models/card.js');
let User = require('./models/user.js');
let Mission = require('./models/mission.js');

let apiRouter = require('./api.js');

let fcm = require('firebase-admin');

fcm.initializeApp({
    credential: fcm.credential.cert({
        project_id: process.env.FCM_PROJECT_ID,
        client_email: process.env.FCM_CLIENT_EMAIL,
        private_key: JSON.parse(process.env.FCM_PRIVATE_KEY),
    })
});

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

    app.get('/missions/:id', authMiddleware, (req, res) => {

        Mission.findOne({_id: req.params.id}).populate("participants.user").exec((err, mission) => {
            if(err) {
                res.status(500).json({error: err});
            }

            if(mission) {
                res.render('mission.ejs', { mission: mission } );
            } else {
                res.status(404).json({error: 'not found'});
            }

        });
    });

    app.get('/manager/missions/:id', (req, res) => {
        let id = (req.params.id == 'new' ? null : req.params.id);

        Mission.findOne({_id: id}, (err, mission) => {

            if(!mission) {
                mission = new Mission()
            }

            res.render('manager/mission.ejs', { mission: mission, mid: req.params.id });
        });
    });

    app.post('/manager/missions/:id', function(req, res) {
        console.log('active' in req.body);

        if (req.params.id == 'new') {
            let mission = Mission(req.body);

            mission.active = 'active' in req.body;
            mission.save();
            res.redirect('/manager/missions/' + mission._id);
        } else {
            Mission.findOne({_id: req.params.id}, (err, mission) => {
                if(err) {
                    res.status(500).json({error: err});
                }

                if(!mission) {
                    res.status(404).json({error: 'not found'});
                }

                mission.set(req.body);
                mission.active = 'active' in req.body;
                mission.save();
                res.redirect('/manager/missions/' + mission._id);
            });
        }
    });

    app.post('/manager/missions/:id/apply', (req, res) => {
        Mission.findOneAndUpdate(
            {_id: req.params.id, 'participants._id': req.body.id},
            {'$set': { 'participants.$.status': req.body.status, 'participants.$.comment': req.body.comment }},
            {new: true}
        ).exec((err, mission) => {
           if(err) {
               console.log(err);
               res.redirect('/profile' );
           }

           res.redirect('/missions/' + mission._id );
        });
    });

    app.post('/manager/users/:user/refill',  (req, res) => {
        User.findOne({_id: req.params.user}).exec((err, user) => {
            if (err) {
                res.status(500).json({error: err});
            }

            const transaction = { amount: req.body.amount, type: "manager", sid: req.user._id}
            user.transactions.push(transaction);
            user.vCoin = user.transactions.reduce((a, b) => a + b.amount, 0);
            user.save();

            const notification = {
                title: "Ви отримали " + transaction.amount + " баллів!",
                body: "Залучайся до соціальних міссій щоб отримати більше."
            };

            fcm.messaging().sendToDevice(user.fcm_id, {
                notification: notification
            }).then((response) => {
                user.notifications.push(notification);
                user.save();
            }).catch((error) => {
                console.log(error);
            });

            res.redirect('/manager/users')
        })
    });

};

function authMiddleware(req, res, next) {

    if (req.isAuthenticated())
        return next();

    req.session.returnTo = req.url;
    res.redirect('/welcome');
}
