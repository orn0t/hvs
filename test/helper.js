const proxyquire = require('proxyquire');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('dotenv').config('../.env');

if (process.env.MOCK_MONGO == 'true') {
    const Mockgoose = require('mockgoose').Mockgoose;
    const mockgoose = new Mockgoose(mongoose);

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

    app = proxyquire('../app', { mongoose: proxiedMongoose });

} else {
    app = require('../app');
}

module.exports.app = app;

module.exports.fix = {
    cleanup: () => { mongoose.connection.db.dropDatabase(err => { if (err) { console.log(err) } } )},
    load: (name) => (require('./fixtures/'+name))()
};
