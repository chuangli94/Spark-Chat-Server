var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

module.exports = {
	development: {
		secret: 'sparkchat',
		mongodb: 'mongodb://localhost:27017/android-chat-node',
		mysqldb: {
			host: 'sparklounge.ck0dqnhtgf3p.us-west-2.rds.amazonaws.com',
			port: 3306,
			user: 'JamesJiang',
			password: 'sparkloungejc',
			database: 'Test'
		},
		rootPath: rootPath,
		port: process.env.PORT || 8080
	},
	production: {
		secret: 'sparkchat',
		mongodb: 'mongodb://admin:admin@ds035663.mongolab.com:35663/spark-chat',
		mysqldb: {
			host: 'sparklounge.ck0dqnhtgf3p.us-west-2.rds.amazonaws.com',
			port: 3306,
			user: 'JamesJiang',
			password: 'sparkloungejc',
			database: 'Test'
		},
		rootPath: rootPath,
		port: process.env.PORT || 8080
	}
}