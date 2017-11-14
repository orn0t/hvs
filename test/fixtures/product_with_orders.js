"use strict";
const ObjectId = require('mongoose').Types.ObjectId;
const Product = require('../../models/product');
module.exports = () => {
    let p = new Product({
        _id: ObjectId('300000000000000000000002'),
        name: 'Test product',
        price: 500,
        orders: [{ user: ObjectId('100000000000000000000001')}]
    });
    return p.save();
};
