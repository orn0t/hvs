"use strict";
const ObjectId = require('mongoose').Types.ObjectId;
const Mission = require('../../models/mission');
module.exports = () => {
    let m = new Mission({
        _id: ObjectId('200000000000000000000002'),
        title: "Mission without participants",
        teaser: "Short teaser about mission. Just several sentences",
        description: "Full description",
        active: true,
        max_participants: 20,
        participants: [{ user: ObjectId('100000000000000000000001') }]
    });
    return m.save();
};
