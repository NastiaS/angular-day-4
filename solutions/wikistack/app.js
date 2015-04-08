var express = require('express');
var swig = require('swig');
var path = require('path');

// this module gives us back a function that takes in swig and uses swig.setFilter. It has to be the SAME swig object that we later use as our app.engine, which is challenging when we break things up into modules like this. Exporting a function that takes an object means we can use the same object in two modules!
require('./filters')(swig);

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// body parser transforms a url-encoded HTTP body (like 'title=some+words&text=other+stuff') and transforms it into a nice JS object we can work with (like {title: 'some words', text: 'other stuff'}). It then puts that object on req.body.
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var addRoutes = require('./routes/add');
var pageRoutes = require('./routes/page');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// attaching our modular routers to given paths
app.use('/', routes);
app.use('/users', users);
app.use('/add', addRoutes);
app.use('/page', pageRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    swig.setDefaults({ cache: false });
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
