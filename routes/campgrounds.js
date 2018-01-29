'use strict'
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');


//INDEX - show all campgrounds
router.get('/', (req, res, next) => {
	// res.render('campgrounds', {campgrounds: campgrounds});
	Campground.find({}, (error, allCampgrounds) => {
		if(error){
			console.log(error);
		} else {
			res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
});

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res, next) => {
	//get data from the form and add  to campground array
	let name = req.body.name,
		image = req.body.image,
		description = req.body.description,
		author = {
			id: req.user._id,
			username: req.user.username
		},
	    newCampground = {name:name , image: image, description: description, author: author};
	//create a new campground and save it to the DB
	Campground.create(newCampground, (error, newlyCreated) => {
		if(error){
			console.log(error);
		} else {
			//redirect back to the campground route
			res.redirect('/campgrounds');
		}
	});

});

//NEW - show form to create a campground
router.get('/new', middleware.isLoggedIn, (req, res, next) => {
	res.render('campgrounds/new');
});

//SHOW - shows more info about one campground
router.get('/:id', (req, res, next) => {
	//find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec((error, foundCampground) => {
		if(error){
			console.log(error);
		} else {
			// console.log(`hello  ${foundCampground}`);
			//render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

//EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
		Campground.findById(req.params.id, (error, foundCampground) => {
			res.render('campgrounds/edit', {campground: foundCampground});
		});
});

//UPDATE campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (error, updatedCampground) => {
		if(error){
			res.redirect('/campgrounds');
		} else {
				//redirect the campground page
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

// Destroy Campground route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (error) => {
		if(error){
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;

