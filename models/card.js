"use strict";

var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    number: {
        type: String,
        length: 16
    },
    status: Boolean
});

module.exports = mongoose.model('Card', cardSchema);