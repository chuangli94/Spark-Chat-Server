/**
 * Module dependencies.
 */
var express  = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var config = require('./config/config')[env];
 
// Configuration
require('./config/express')(app, config);
 
// mongodb connection
require('./config/mongoose')(config);

// Routes
require('./config/routes')(app);
 
app.listen(config.port);
console.log('The App runs on port ' + config.port);