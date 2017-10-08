"use strict";

let express = require('express');
let router = express.Router();

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

    return router;
};
