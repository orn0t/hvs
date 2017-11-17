"use strict";
const expect = require("chai").expect;
let request = require('supertest');

const app = require('./helper').app;
const fix = require('./helper').fix;

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

describe('Mobile APP api', () => {

    after(() => {
        fix.cleanup();
    });

    describe('Profile', () => {

        before(() => {
            fix.load('volunteer_no_coins');
        });

        after(() => {
            fix.cleanup();
        });

        it('Must not login with wrong user', (done) => {
            request(app)
                .get('/api/v1.0/profile/')
                .set('debug_user', 'not_existing@gmail.com')
                .expect(403, done)
        });

        it('Must return user profile', (done) => {
            request(app)
                .get('/api/v1.0/profile/')
                .set('debug_user', 'test@gmail.com')
                .expect(200, done)
                .expect(function (res) {
                    expect(res.body).to.have.a.property('_id');
                    expect(res.body).to.have.a.property('name');
                    expect(res.body).to.have.a.property('vCoin');
                });
        });
    });

    describe('Missions', () => {

        before(() => {
            fix.load('volunteer_no_coins');
            fix.load('mission_without_participants');
            fix.load('mission_with_participants');
        });

        after(() => {
            fix.cleanup();
        });

        it('Must return missions list', (done) => {
            request(app)
                .get('/api/v1.0/missions')
                .set('debug_user', 'test@gmail.com')
                .expect(200, done)
                .expect((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);
                });
        });

        it('Must return single mission', (done) => {
            request(app)
                .get('/api/v1.0/missions/200000000000000000000001')
                .set('debug_user', 'test@gmail.com')
                .expect(200, done)
                .expect((res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body._id).to.be.equal('200000000000000000000001');
                });
        });
    });

    describe('Products', () => {

        before(() => {
           fix.load('volunteer_no_coins');
           fix.load('product_without_orders');
           fix.load('product_with_orders');
        });

        after(() => {
            fix.cleanup();
        });

        it('Must return products list', (done) => {
           request(app)
               .get('/api/v1.0/products')
               .set('debug_user', 'test@gmail.com')
               .expect(200, done)
               .expect((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);
               });
        });
    });
});
