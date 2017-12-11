'use strict';
const bodyParser = require('body-parser'),
 	  express = require("express"),
	  app = express(),
      mongoose = require('mongoose');

//create database
mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
const port = app.get('port');


//Schema setup

let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,

});

let Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
// 	{name: 'Salmon Creek' , image: 'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg'},
// 	(error, campground) => {
// 		if (error){
// 			console.log(error);
// 		}
// 		else {
// 			console.log('Newly created campground');
// 			console.log(campground);
// 		}
// 	});


app.get('/' , (req, res, next) => {
	res.render("landing");
});

app.get('/campgrounds', (req, res, next) => {
	// res.render('campgrounds', {campgrounds: campgrounds});
	Campground.find({}, (error, allCampgrounds) => {
		if(error){
			console.log(error);
		} else {
			res.render('campgrounds', {campgrounds:allCampgrounds})
		}

	});
});

app.get('/campgrounds/new', (req, res, next) => {
	res.render('new');
});

app.post('/campgrounds', (req, res, next) => {
	//get data from the form and add  to campground array
	let name = req.body.name;
	let image = req.body.image;
	let newCampground = {name:name , image: image};
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