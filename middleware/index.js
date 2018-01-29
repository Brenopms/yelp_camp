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
                res.redirect("back");																																																																																																																																																																																																																																																																																											
            } else {
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
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

middlewareObj.checkCommentOwnership = function(req, res, next){
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


middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = middlewareObj