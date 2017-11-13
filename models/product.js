"use strict";

let mongoose = require('mongoose');

let schemaOrder = mongoose.Schema({
    created: { type: Date, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['NEW', 'DECLINED', 'APPROVED'],
        default: 'NEW'
    }
});

let schemaProduct = mongoose.Schema({
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
    orders: [schemaOrder],
    active: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', schemaProduct);