var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var db = require('../db');

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('API EVENT');
    next(); // make sure we go to the next routes and don't stop here
});

/* Get API status */
router.get('/', function (req, res) {
    res.json({status:'working', version: '1.0', manual: 'http://github.com/angseus/strecku'});
});

/* User routes */
// get a list of all users
router.get('/users', function (req, res) {
	db.query('SELECT * FROM user_details', function(err, result, fields) {
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error'});
        }
    });
});

// get a specific user based on user id
router.get('/users/:id', function(req, res){
    db.query('SELECT * FROM user_details WHERE id = "' + req.params.id + '"', function(err, result, fields) {
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message: 'no such user'});
        }
    });
});

// search for a user based on firstname or lastname
router.get('/users/search/:name', function(req, res){
    db.query('SELECT * FROM user_details WHERE firstname LIKE "' + req.params.name + '"' + ' OR lastname LIKE "' + req.params.name + '"' + ' ORDER BY firstname', function(err, result, fields) {
    if (err) throw err;
    if (result[0]){
        res.json(result);
    }
    else{
        res.json({status:'error', message: 'no such user'});
    }
    });
});



/* TO BE ADDED TO MIDDLEWARE IN ORDER TO CHECK FOR AUTHENTICATION */
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;