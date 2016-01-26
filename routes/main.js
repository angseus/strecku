var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


// main page - NOT PASSWORD PROTECTED SINCE WE CHECK USER
router.get('/', function (req, res) {
    res.render('main', { user : req.user });
});

// admin page - PASSWORD PROTECTED 
router.get('/admin', isLoggedIn, function(req, res) {
    res.render('admin', { user : req.user });
});

// register / adduser form - PASSWORD PROTECTED 
router.get('/register', isLoggedIn, function(req, res) {
    res.render('register', { });
});

router.post('/register', isLoggedIn, function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

// login / logout actions - NOT PASSWORD PROTECTED
router.get('/login', function(req, res) {
    res.redirect('/');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/status', function(req, res){
    res.status(200).send("Up and running.");
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