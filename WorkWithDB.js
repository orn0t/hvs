var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

let Mission = require('./models/mission');

module.exports.formHandler = function(req, res, next) {

    let newMission = new Mission({
        title: req.body.title,
        teaser: req.body.teaser,
        description: req.body.description,
    });
    
    newMission.save();

    res.redirect('/profile');

};