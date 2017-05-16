
let FacebookStrategy = require('passport-facebook').Strategy

module.exports = (passport) => {
    "use strict";

    passport.use(new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: '/auth/callback'
    }))
};