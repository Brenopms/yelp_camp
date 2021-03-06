'use strict'
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//root
router.get('/' , (req, res, next) => {
	res.render("landing");
});


//--------------------- AUTH ROUTES --------------------------------
router.get('/register', (req, res) => {
	res.render('register', {page: 'login'});
});

//handle sign up logic
router.post('/register', (req, res) => {
	const newUser = new User({username: req.body.username});
	if (req.body.adminCode === 'secretcoder'){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, (error, user) => {
		if(error){
			req.flash('error', error.message);
			return res.redirect('register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', `Welcome to YelpCamp ${user.username}`);
			res.redirect('/campgrounds');
		});
	});
});

//Show login form
router.get('/login', (req,res) => {
	res.render('login', {message: req.flash('error'), page: 'login'});
});

router.post('/login', passport.authenticate('local', 
{
	successRedirect: '/campgrounds',
	failureRedirect: '/login',
	successFlash: true,
	failureFlash: true
}), (req, res) => {	
	//passport alredy handles the route
});

//Logout Route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged you out');
	res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
