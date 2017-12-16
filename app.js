'use strict';
const bodyParser = require('body-parser'),
 	  express = require("express"),
	  app = express(),
	  mongoose = require('mongoose'),
	  Campground = require('./models/campground'),
	  seedDB = require('./seeds');

	  
//create database
mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
const port = app.get('port');

//Seed data
seedDB();

app.get('/' , (req, res, next) => {
	res.render("landing");
});

//INDEX - show all campgrounds
app.get('/campgrounds', (req, res, next) => {
	// res.render('campgrounds', {campgrounds: campgrounds});
	Campground.find({}, (error, allCampgrounds) => {
		if(error){
			console.log(error);
		} else {
			res.render('index', {campgrounds:allCampgrounds});
		}

	});
});

//NEW - show form to create a campground
app.get('/campgrounds/new', (req, res, next) => {
	res.render('new');
});

//SHOW - shows more info about one campground
app.get('/campgrounds/:id', (req, res, next) => {
	//find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec((error, foundCampground) => {
		if(error){
			console.log(error);
		} else {
			console.log('hello' + foundCampground);
			//render show template with that campground
			res.render('show', {campground: foundCampground});
		}
	});
});

//CREATE - add new campground to DB
app.post('/campgrounds', (req, res, next) => {
	//get data from the form and add  to campground array
	let name = req.body.name,
	    image = req.body.image,
	    description = req.body.description,
	    newCampground = {name:name , image: image, description: description};
	//create a new campground and save it to the DB
	Campground.create(newCampground, (error, newlyCreated) => {
		if(error){
			console.log(error);
		} else {
			//redirect back to the campground route
			res.redirect('/campgrounds');
		}
	});

})

app.listen(port, () => {
	console.log('Server running on port: ', port);
});