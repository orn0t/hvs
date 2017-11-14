"use strict";
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../../models/user');
module.exports = () => {
    let u = new User({
        _id: ObjectId('100000000000000000000002'),
        facebook: {
            email: 'test@gmail.com',
            name: 'John Snow',
            id: 11111,
            token: 'fb_test_token'
        },
        roles: ['volunteer'],
        vCoin: 20000
    });
    return u.save();
};
