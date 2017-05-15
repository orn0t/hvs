"use strict";

var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connect(process.env.MONGODB_URI);

app.set('port', (process.env.PORT || 3000));

require('./routes.js')(app);

app.listen(app.get('port'), function () {
    console.log('Example app listening on port', app.get('port'));
});