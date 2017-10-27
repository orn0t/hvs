"use strict";

let mongoose = require('mongoose');

let schemaMission = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: ''
    },
    teaser: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    telegram_chat: {
        type: String,
        default: ''
    },
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
        default: false
    }
});

module.exports = mongoose.model('Mission', schemaMission);
