// External dependencies
var async = require('async');
var bigint = require('bigint');
var express = require('express');

var app = express.createServer();

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

app.configure('development', function() {
 	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
 	app.use(express.errorHandler()); 
});

app.configure('test', function() {
 	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 	
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);