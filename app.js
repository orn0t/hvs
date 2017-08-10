"use strict";

let express = require('express');
let mongoose = require('mongoose');
let session = require('express-session');
let passport = require('passport');

let app = express();

mongoose.connect(process.env.MONGODB_URI);

app.set('port', (process.env.PORT || 3000));

app.use(session({ secret: 'wazzzapmakersgonnamake'}));
app.use(passport.initialize());
app.use(passport.session());

var engine = require('ejs-locals');

app.engine('ejs', engine);
app.set('view cache', false);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

require('./auth.js')(passport);
require('./routes.js')(app, passport);

app.listen(app.get('port'), function () {
    console.log('Example app listening on port', app.get('port'));
});