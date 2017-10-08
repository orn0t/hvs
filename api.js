"use strict";

let express = require('express');
let router = express.Router();

module.exports = (passport) => {
    router.all('*', passport.authenticate('facebook-token'), (req, res, next) => {
        next(req, res);
    });

    router.get('/v1.0/profile', (req, res) => {
        // @todo: filter sensitive fields
        res.json(req.user);
    });

    return router;
};
