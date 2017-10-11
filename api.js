"use strict";

let express = require('express');
let router = express.Router();

let Mission = require('./models/mission.js');

module.exports = (passport) => {
    router.all('*', (req, res, next) => {
        passport.authenticate('facebook-token', (err, user, info) => {
            if (err) {
                res.status(500).json({error: err, info: info}).end();
            }

            req.user = user;

            return next();
        })(req, res);
    });

    router.get('/v1.0/profile', (req, res) => {
        res.json(req.user);
    });

    router.get('/v1.0/missions', (req, res) => {
        Mission.find({}).exec((err, missions) => {
            if(err) {
                res.status(500).json({error: err});
            }

            res.json(missions);
        });
    });

    return router;
};
