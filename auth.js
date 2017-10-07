"use strict";

let FacebookStrategy = require('passport-facebook').Strategy;

let User = require('./models/user');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: '/auth/fb/callback',
        profileFields: ['id', 'displayName', 'email']
    }, (token, refreshToken, profile, done) => {

        User.findOne({ 'facebook.id' : profile.id }, (err, user) => {

            if (err)
                return done(err);

            if (user) {
                return done(null, user);
            } else {

                // if there is no user found with that facebook id, create them
                let newUser = new User();

                newUser.facebook.id    = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.name  = profile.displayName;
                newUser.roles = ['volunteer'];

                if(profile.emails && profile.emails.length) {
                    newUser.facebook.email = profile.emails[0].value;
                }

                newUser.save((err) => {
                    if (err)
                        throw err;

                    return done(null, newUser);
                });
            }

        });

    }));
};
