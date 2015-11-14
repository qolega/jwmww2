
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');

// Database
var config = require('./config/jwmww2-config');  // load the database config
mongoose.connect(config.url);

mongoose.set('debug', false);
mongoose.set('debug', function (collectionName, method, query, doc, options) {
  //console.log(query);
});

require('./config/passport')(passport); // pass passport for configuration

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/public')));

// required for passport
app.use(session({ secret: config.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

var routes = require('./routes/index');
var warrior = require('./routes/warrior');
var countriesRoute = require('./routes/countries-route');
//var userRoutes = require('./routes/user');
var warriorAdmin = require('./routes/warrior-admin');
var authRoute = require('./routes/auth.js');

// routes
app.use('/', routes);
app.use('/api', warrior);
app.use('/api', countriesRoute);
app.use('/api', authRoute);
app.use('/api', warriorAdmin);
//app.use('/api', userRoutes);

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
