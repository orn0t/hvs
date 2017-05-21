"use strict";

let mongoose = require('mongoose');

let schemaUser = mongoose.Schema({
    vCoin: {
        type: Number,
        default: 0
    },
    roles: [{type: String}],
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

module.exports = mongoose.model('User', schemaUser);
