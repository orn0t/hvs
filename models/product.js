"use strict";

let mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    name: String,
    description: String,
    giver: String,
    price: { type: Number },
    photo: String,
    amount: { type: Number },
    type: {
        type: String,
        enum: ['REAL', 'VIRTUAL'],
        default: 'REAL'
    },
    active: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);