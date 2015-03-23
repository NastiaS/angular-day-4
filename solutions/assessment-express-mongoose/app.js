var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var async = require('async');

var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// here is some custom error-handling middleware I wrote just to get rid of the huge stack trace in our test results. It is error-handling because it has FOUR named parameters instead of three, so Express knows to pass in the error object into the first parameter and the other objects into each following parameter.
// The function simply logs out the short error message (if it exists) and sends a 500 (or the error.status) to the front end. No more big stack trace.
app.use(function(err, req, res, next){
  if (err.message) console.error(err.message);
  res.status(err.status || 500).send();
});

module.exports = app;
