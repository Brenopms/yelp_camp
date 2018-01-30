'use strict'
const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment')
const middleware = require('../middleware');

// --------------------- Comments Route ---------------------------

router.get('/new', middleware.isLoggedIn, (req, res, next) => {
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
router.post('/', middleware.isLoggedIn, (req, res, next) => {
	//lookup campgorund using ID
	Campground.findById(req.params.id, (error, campground) => {
		if (error){
			console.log('error');
			res.redirect('/campground')
		} else {
			//create new commen
			Comment.create(req.body.comment, (error, comment) =>{
				if(error){
					req.flash('error', 'Something went wrong');
					console.log(error);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//add new comment
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully added comment!');
					//redirect to show page
					res.redirect(`/campgrounds/${campground._id}`);
				}
			})
		}
	});
});

//EDIT Comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership,  (req, res) => {
	Comment.findById(req.params.comment_id, (error, foundComment) => {
		if(error){
			res.redirect('back');
		} else {
			res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE Comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error, updatedComment) => {
		if(error){
			res.redirect('back');
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	})
});

//DESTROY Comment
router.delete('/:comment_id/', middleware.checkCommentOwnership, (req, res) => {
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, (error) => {
		if(error){
			req.flash('error', 'Something went wrong!');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted');
			res.redirect('back');
		}
	});
});

module.exports = router;

