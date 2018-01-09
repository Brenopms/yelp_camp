'use strict'
const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment')

// --------------------- Comments Route ---------------------------

router.get('/new', isLoggedIn, (req, res, next) => {
	//find campground by ID
	Campground.findById(req.params.id, (error, campground) => {
		if(error){
			console.log(error);
		} else {
			res.render('comments/new', {campground: campground})
		}
	})
});

//Create a comment
router.post('/', isLoggedIn, (req, res, next) => {
	//lookup campgorund using ID
	Campground.findById(req.params.id, (error, campground) => {
		if (error){
			console.log('error');
			res.redirect('/campground')
		} else {
			//create new commen
			Comment.create(req.body.comment, (error, comment) =>{
				if(error){
					console.log(error);
				} else {
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					//redirect to show page
					res.redirect(`/campgrounds/${campground._id}`);
				}
			})
		}
	});
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;

