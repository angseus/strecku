var mysql = require('mysql');

// mysql
var db = mysql.createConnection({
  host     : 'angseus.ninja',
  user     : 'strecku',
  password : 'strecku',
  database : 'strecku'
});

db.connect();

module.exports = db;