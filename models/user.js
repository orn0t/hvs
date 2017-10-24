"use strict";

let mongoose = require('mongoose');

let schemaTransaction = mongoose.Schema({
    created: { type: Date, default: Date.now },
    amount: Number,
    type: String,
    sid: mongoose.Schema.Types.ObjectId
});

let schemaUser = mongoose.Schema({
    vCoin: {
        type: Number,
        default: 0
    },
    transactions: [schemaTransaction],
    roles: [{type: String}],
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
}, {
    toJSON: { virtuals: true }
});

schemaUser.virtual('is_manager').get(function () {
    return this.roles && this.roles.includes('manager')
});

schemaUser.virtual('name').get(function () {
    return this.facebook.name
});

module.exports = mongoose.model('User', schemaUser);
