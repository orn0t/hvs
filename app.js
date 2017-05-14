"use strict";

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
    res.send('Hello Volunteer!');
});

app.get('/test_ci', (req, res)=>{
    res.send('test ci')
})

app.listen(app.get('port'), function () {
    console.log('Example app listening on port', app.get('port'));
});
