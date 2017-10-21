"use strict";

let mongoose = require('mongoose');

let schemaMission = mongoose.Schema({
    title: String,
    teaser: String,
    description: String,
    telegram_chat: String,
    date_from: Date,
    date_to: Date,
    time: Number,
    city: String,
    max_participants: {
        type: Number,
        min: 1
    },
    reward: {
        type: Number,
        min: 10
    },
    active: {
        type: Boolean,
        default: true
    }


});

module.exports = mongoose.model('Mission', schemaMission);
