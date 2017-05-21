"use strict";

let express = require('express');
let mongoose = require('mongoose');

let passport = require('passport');

let app = express();

mongoose.connect(process.env.MONGODB_URI);

app.set('port', (process.env.PORT || 3000));

require('./routes.js')(app, passport);

app.listen(app.get('port'), function () {
    console.log('Example app listening on port', app.get('port'));
});