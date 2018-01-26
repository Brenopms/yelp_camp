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
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//add new comment
					campground.comments.push(comment);
					campground.save();
					//redirect to show page
					res.redirect(`/campgrounds/${campground._id}`);
				}
			})
		}
	});
});

//EDIT Comment
router.get('/:comment_id/edit', checkCommentOwnership,  (req, res) => {
	Comment.findById(req.params.comment_id, (error, foundComment) => {
		if(error){
			res.redirect('back');
		} else {
			res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE Comment
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error, updatedComment) => {
		if(error){
			res.redirect('back');
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	})
});

//DESTROY Comment
router.delete('/:comment_id/', checkCommentOwnership, (req, res) => {
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, (error) => {
		if(error){
			res.redirect('back');
		} else {
			res.redirect('back');
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

function checkCommentOwnership(req, res, next){
	// is the user logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (error, foundComment) => {
			if(error){
				res.redirect("back");																																																																																																																																																																																																																																																																																											
			} else {
				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} 	
	else {
		res.redirect('back');
	}
}


module.exports = router;

