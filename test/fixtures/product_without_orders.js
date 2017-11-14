"use strict";
const ObjectId = require('mongoose').Types.ObjectId;
const Product = require('../../models/product');
module.exports = () => {
    let p = new Product({
        _id: ObjectId('300000000000000000000001'),
        name: 'Test product',
        price: 500
    });
    return p.save();
};
