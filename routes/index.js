'use strict'
const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../models/user');

//root
router.get('/' , (req, res, next) => {
	res.render("landing");
});


//--------------------- AUTH ROUTES --------------------------------
router.get('/register', (req, res) => {
	res.render('register');
});

//handle sign up logic
router.post('/register', (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (error, user) => {
		if(error){
			console.log(error);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/campgrounds');
		});
	});
});

//Show login form
router.get('/login', (req,res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local', 
{
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}), (req, res) => {	
});

//Logout Route
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
