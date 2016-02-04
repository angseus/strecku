var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var db = require('../db');
var request = require("request")

/* GET standard page */
router.get('/', isLoggedIn, function (req, res) {
    res.send('Specify a user'); // No user found
});

/* GET users listing. */
router.get('/:id', isLoggedIn, function (req, res) {
    db.query('SELECT id FROM users WHERE username = "' + req.params.id + '"', function(err, rows, fields) {
        if (err) throw err;
        if (!rows[0]){
            console.log('No user with such a nick');
            res.json({status:'error', message:'No user with such a nick'});
        }
        else{
            res.render('user', {user: req.user}); // send it to render function
        }
    });
});


router.get('/:id', function(req, res){
    res.render('user', ({userdata: rows[0], user: req.user}));
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;