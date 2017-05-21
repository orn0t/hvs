"use strict";

var http = require('http'),
    domain = require('domain'),
    express = require('express'),
    session = require('express-session'),
    pgSession = require('connect-pg-simple')(session),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    moment = require('moment'),
    bcrypt = require('bcrypt-nodejs'),
    pg = require('pg'),
    bodyParser = require('body-parser'),
    prettify = require('./prettify.js')(),
    errorCodes = require('./errorCodes.js'),
    db = require('./db.js')(pg, prettify),
    User = require('./entities/User.js')(pg, db, errorCodes, bcrypt),
    EventModel = require('./entities/Event.js')(pg, db),
    Project = require('./entities/Project.js')(pg, db),
    Donate = require('./entities/Donate.js')(pg, db, _, moment),
    methods = require('./methods.js')(_, pg, User, EventModel, Project, Donate, errorCodes),
    app = express();

mongoose.connect(process.env.MONGODB_URI);

app.set('port', (process.env.PORT || 3000));

require('./routes.js')(app);

// app.use(cookieParser());
app.use(bodyParser.json({
    limit: '150mb'
})); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true }));

console.log(process.env.DATABASE_URL)

app.use(session({
    store: new pgSession({
        conString: process.env.DATABASE_URL
    }),
    secret: 'htPG2JNeMbU2AUONcWYN',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(express.static('public'));

app.post('/*', function (req, res) {
    var session = req.session;
    console.log(session)

    var methodName = req.url.split('/')[1]
    console.log(methodName, req.body);

    var apiSession = {
        userPriviledge: 'guest',
        userId: null
    }

    if(session.userId){
        apiSession.userPriviledge = session.userPriviledge;
        apiSession.userId = session.userId;
    }

    if(!_.isObject(methods[apiSession.userPriviledge]) || !_.isFunction(methods[apiSession.userPriviledge][methodName])){
        res.status(403).json({err: {
            code: errorCodes.accessDenied,
            message: 'Access denied'
        }})
    } else {
        methods[apiSession.userPriviledge][methodName](apiSession, req.body, function(err, data, newSessionData){
            if(err){
                res.status(400).json({err: err})
            } else {
                if(_.isObject(newSessionData)){
                    if(_.isUndefined(newSessionData.userPriviledge)){
                        session.destroy(err=>{
                            if(err){
                                res.status(500).json({err});
                            } else {
                                res.json({err: null, data})
                            }
                        })
                    } else {
                        session.userPriviledge = newSessionData.userPriviledge;
                        session.userId = newSessionData.userId;
                        session.save(err=>{
                            if(err){
                                res.status(500).json({err});
                            } else {
                                res.json({err: null, data})
                            }
                        })
                    }
                } else {
                    res.json({err: null, data})
                }
            }
        })
    }
})


http.createServer(app).listen(app.get('port'));

