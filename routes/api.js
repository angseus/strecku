var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var db = require('../db');

/**************/
/* Middleware */
/**************/
router.use(function(req, res, next) {
    // do logging
    console.log('API EVENT');
    next(); // make sure we go to the next routes and don't stop here
});

/******************/
/* Get API status */
/******************/
router.get('/', function (req, res) {
    res.json({status:'working', version: '1.0', manual: 'http://github.com/angseus/strecku'});
});

/***************/
/* User routes */
/***************/
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

// get purchases made by user
router.get('/users/:id/purchases', function(req, res){
    db.query('SELECT * FROM purchase_details WHERE user = "' + req.params.id + '"', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no purchases for user'});
        }
    });
});

// get purchases made by user based on product
router.get('/users/:id/purchases/product/' , function(req, res){
    res.json({status:'error', message:'specify a product'});
});
router.get('/users/:id/purchases/product/:product', function(req, res){
    db.query('SELECT * FROM purchase_details WHERE user = "' + req.params.id + '" AND product = "' + req.params.product + '"', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no purchases for user'});
        }
    });
});

// get recent purchases made by user
router.get('/users/:id/purchases/recent/', function(req, res){
    res.json({status:'error', message:'specify a number of recent purchases'});
});
router.get('/users/:id/purchases/recent/:number', function(req, res){
    db.query('SELECT * FROM purchase_details WHERE user = "' + req.params.id + '" ORDER BY time DESC LIMIT ' + req.params.number, function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no purchases for user'});
        }
    });
});

// get codes for a user 
router.get('/users/:id/codes', function(req, res){
    db.query('SELECT * FROM user_codes WHERE user = "' + req.params.id + '"', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no codes for user'});
        }
    });
});

// get groups for a user 
router.get('/users/:id/groups', function(req, res){
    db.query('SELECT group_id FROM users WHERE id = "' + req.params.id + '"', function(err, result, fields)
    {
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no group for user'});
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

// search for a user based on post
router.get('/users/post/:post', function(req, res){
    db.query('SELECT * FROM user_details WHERE position = "' + req.params.post + '"' + ' ORDER BY year', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message: 'no such user'});
        }
    });
});

/* Insert, update and delete on users*/ 

/********************/
/* Purchases routes */
/********************/
// get all purchases
router.get('/purchases/', function(req, res){
    db.query('SELECT * FROM purchase_details', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no purchases'});
        }
    });
});

// get purchases based on product
router.get('/purchases/product/:product', function(req, res){
    db.query('SELECT * FROM purchase_details WHERE product = "' + req.params.product + '"', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no purchases for product'});
        }
    });
});

/*******************/
/* Products routes */
/*******************/
// get all products
router.get('/products/', function(req, res){
    db.query('SELECT * FROM products', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no products'});
        }
    });
});

// get product based on code
router.get('/products/:code', function(req, res){
    db.query('SELECT * FROM products WHERE barcode ="' + req.params.code + '"', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no product with code'});
        }
    });
});

// get all products based on category
router.get('/products/category/:category', function(req, res){
    db.query('SELECT * FROM products WHERE category = "' + req.params.category + '"', function(err, result, fields){
        if (err) throw err;
        if (result[0]){
            res.json(result);
        }
        else{
            res.json({status:'error', message:'no products in category'});
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