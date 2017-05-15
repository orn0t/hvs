"use strict";

var Card  = require('./models/card.js');

module.exports = (app) => {
    app.get('/card/:number', (req, res) => {
        Card.findOne({number: req.params.number}, (err, card) => {
            if(err) {
                res.status(500).json({error: err})
            }

            if(card) {
                res.json(card)
            } else {
                res.status(404).json({error: 'Not found'})
            }
        })
    })
};