var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var db = require('../db');

/* GET standard page */
router.get('/', isLoggedIn, function (req, res) {
    res.send('Specify a user'); // No user found
});

/* GET users listing. */
router.get('/:id', isLoggedIn, function (req, res) {
    db.query('SELECT id FROM users WHERE username = "' + req.params.id + '"', function(err, rows, fields) {
        if (err) throw err;
        if (!rows[0]){
            console.log('No such user');
            res.send('No such user'); // CHANGE TO JSON
        }
        else{
            console.log(rows[0].id);
            res.render('user', ({id: rows[0].id}, {user: req.user}));
        }
    });
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