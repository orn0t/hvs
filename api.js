"use strict";

let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();

let Mission = require('./models/mission.js');
let User = require('./models/user.js');
let Product = require('./models/product.js');

module.exports = (passport) => {
    router.all('*', (req, res, next) => {
        if(process.env.API_DEBUG) {
            User.findOne({'facebook.email': req.get('debug_user')}, (err, user) => {
                if(err) {
                    res.status(500).json({error: err});
                }

                if(!user) {
                    res.status(404).json({error: 'not found'});
                } else {
                    req.user = user;

                    return next();
                }
            });
        } else {
            passport.authenticate('facebook-token', (err, user, info) => {
                if (err) {
                    res.status(500).json({error: err, info: info}).end();
                }

                req.user = user;

                return next();
            })(req, res);
        }
    });

    router.get('/v1.0/profile', (req, res) => {
        res.json(req.user);
    });

    router.get('/v1.0/products', (req, res) => {
        Product.find({}).exec((err, products) => {
            if(err) {
                res.status(500).json({error: err});
            }
            res.json(products);
        });
    });

    router.get('/v1.0/missions', (req, res) => {
        Mission.find({}).populate('participants.user').exec((err, missions) => {
            if(err) {
                res.status(500).json({error: err});
            }

            missions = missions.map(m => {
                m = m.toObject();
                m.participants = m.participants.map(a => {
                    if(a.status == 'APPROVED' || a.user._id.equals(req.user._id)) {
                        return {
                            id: a._id,
                            user_id: a.user._id,
                            name: a.user.facebook.name,
                            fb_id: a.user.facebook.id,
                            status: a.status,
                            comment: a.comment
                        };
                    }
                });
                return m;
            });

            res.json(missions);
        });
    });

    router.get('/v1.0/missions/:mission', (req, res) => {
       Mission.findOne({_id: req.params.mission}).exec((err, mission) => {
           if(err) {
               res.status(500).json({error: err});
           }

           if(null == mission) {
               res.status(404).json({message: "mission not found"});
           } else  {
               res.json(mission);
           }

        });
    });

    router.post('/v1.0/profile/fcm', (req, res) => {
        req.user.fcm_id = req.body.fcm_id;
        req.user.save();

        res.status(200).json({status: 'OK'});
    });

    router.post('/v1.0/missions/:mission/apply', (req, res) => {
        Mission.findOne({_id: req.params.mission}).exec((err, mission) => {
            if(err) {
                res.status(500).json({error: err});
            }

            if(!mission) {
                res.status(404).json({message: "mission not found"});
            }

            let participant = mission.participants.filter(a => a.user.equals(req.user._id)).pop();

            if (participant) {
                if (participant.status == 'REFUSED') {
                    participant.status = 'NEW';

                    // todo: send manager notification here
                } else {
                    return res.status(403).json({error: 'cant apply on mission'});
                }
            } else {
                if(mission.participants.length == mission.max_participants) {
                    return res.status(403).json({error: 'cant apply on mission'});
                } else {
                    participant = {
                        user: mongoose.Types.ObjectId(req.user._id)
                    };
                    mission.participants.push(participant);
                }
            }

            mission.save();

            mission.populate('participants.user', (err) => {
                mission = mission.toObject()
                mission.participants = mission.participants.map(a => {
                    if(a.status == 'APPROVED' || a.user._id.equals(req.user._id)) {
                        return {
                            id: a._id,
                            user_id: a.user._id,
                            name: a.user.facebook.name,
                            fb_id: a.user.facebook.id,
                            status: a.status,
                            comment: a.comment
                        };
                    }
                });
                res.status(200).json(mission);
            });
        });
    });

    router.post('/v1.0/missions/:mission/refuse', (req, res) => {
        Mission.findOneAndUpdate(
            {_id: req.params.mission, 'participants.user': req.user._id},
            {'$set': { 'participants.$.status': 'REFUSED', 'participants.$.comment': req.body.comment }},
            {new: true}
        ).exec((err, mission) => {
            if(err) {
                res.status(500).json({error: err});
            }

            if(!mission) {
                res.status(404).json({message: "mission not found"});
            }

            // todo: send manager notification here

            mission.populate('participants.user', (err) => {
                mission = mission.toObject()
                mission.participants = mission.participants.map(a => {
                    if(a.status == 'APPROVED' || a.user._id.equals(req.user._id)) {
                        return {
                            id: a._id,
                            user_id: a.user._id,
                            name: a.user.facebook.name,
                            fb_id: a.user.facebook.id,
                            status: a.status,
                            comment: a.comment
                        };
                    }
                });
                res.status(200).json(mission);
            });
        });
    });
    
    return router;
};
