var express = require('express');
var connect = require('connect');

module.exports = function(app, config) {
		app.use(connect.logger('dev'));
    	app.use(connect.cookieParser());
    	app.use(connect.bodyParser());
    	app.use(connect.json());
    	app.use(connect.urlencoded());
    	app.use(express.static(config.rootPath + '/public'));

    	app.set('secret', config.secret);
}