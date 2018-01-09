'use strict';
const bodyParser = require('body-parser'),
 	  express = require("express"),
	  app = express(),
	  mongoose = require('mongoose'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local'),
	  Campground = require('./models/campground'),
	  Comment = require('./models/comment'),
	  User = require('./models/user'),
	  seedDB = require('./seeds');

//require routes
const commentRoutes = require('./routes/comments'),
	  campgroundRoutes = require('./routes/campgrounds'),
	  indexRoutes = require('./routes/index');
	  
//create database
mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
const port = app.get('port');

//Seed data
seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Once again',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, () => {
	console.log('Server running on port: ', port);
});