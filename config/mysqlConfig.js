var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'sparklounge.ck0dqnhtgf3p.us-west-2.rds.amazonaws.com',
	port: 3306,
	user: 'JamesJiang',
	password: 'sparkloungejc',
	database: 'Test'
});

connection.connect();

connection.query('SELECT * FROM users', function(err, rows, fields) {
	if (err) console.log(err);
	else console.log("Got back: " + JSON.stringify(rows));
});