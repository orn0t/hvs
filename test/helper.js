const proxyquire = require('proxyquire');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

let config = require('../ecosystem.config').apps[0].env;

process.env = config;

const proxiedMongoose = {
    connect: (db) => {
        before((done) => {
            mockgoose.prepareStorage().then(function() {
                mongoose.connect(db, (err) => {
                    done(err);
                });
            });
        });
    }
};

module.exports.app = proxyquire('../app', { mongoose: proxiedMongoose });

module.exports.fix = {
    cleanup: () => { mongoose.connection.db.dropDatabase(err => { if (err) { console.log(err) } } )},
    load: (name) => (require('./fixtures/'+name))()
};
