var mongoose = require('mongoose'),
	userModel = require('../models/User');
 
module.exports = function(config) {
	mongoose.connect(config.mongodb);
	var db = mongoose.connection;
	db.on('err', console.error.bind(console, 'connection err'));
	db.once('open', function callback() {
		console.log('spark-chat db opened');
	});
}