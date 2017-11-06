"use strict";

let mongoose = require('mongoose');

let schemaParticipant = mongoose.Schema({
    created: { type: Date, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['NEW', 'DECLINED', 'APPROVED', 'REFUSED'],
        default: 'NEW'
    },
    comment: { type: String, default: '' }
});

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
    start: {
        type: Date,
        default: Date.now
    },
    finish: {
        type: Date,
        default: Date.now
    },
    time: Number,
    city: String,
    participants: [schemaParticipant],
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
