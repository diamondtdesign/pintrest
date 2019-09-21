'use strict';

var express = require('express');
var routes = require('./routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var bodyParser = require('body-parser')

require('./config/passport')(passport);
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

mongoose.connect(process.env.MONGOLAB_URI);

var babelify = require( 'express-babelify-middleware');
app.get('/bundle.js', babelify('client/index.jsx',
{ // browserify options
  grep: /\.jsx?$/
  }, { // babelify options
    presets: ["react"]
  }
));

app.use('/', express.static(process.cwd() +  '/public'));
        
app.use(session({
	secret: process.env.SECRET_SESSION || 'superSecureSecret',
	  resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 3000;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});