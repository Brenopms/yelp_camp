'use strict';
const Campground = require('../models/campground');
const Comment = require('../models/comment');


//All middleware comes here

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is the user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (error, foundCampground) => {
            if(error){
                req.flash('error', 'Campground not found');
                res.redirect("back");																																																																																																																																																																																																																																																																																											
            } else {
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You do not have permission todo that');
                    res.redirect('back');
                }
            }
        });
    } 	
    else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is the user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (error, foundComment) => {
            if(error){
                req.flash('error', 'Error in database. We are sorry!');
                res.redirect("back");																																																																																																																																																																																																																																																																																											
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that!");
                    res.redirect('back');
                }
            }
        });
    } 	
    else {
        req.flash('error', 'You need to be logged in to do that!');
        res.redirect('back');
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
    }
    req.flash('error', 'You need to be logged in to do that');
	res.redirect('/login');
}

module.exports = middlewareObj