"use strict";
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../../models/user');
module.exports = () => {
    let u = new User({
        _id: ObjectId('100000000000000000000001'),
        facebook: {
            email: 'test@gmail.com',
            name: 'John Snow',
            id: 1,
            token: 'fb_test_token'
        },
        roles: ['volunteer']
    });
    return u.save();
};
