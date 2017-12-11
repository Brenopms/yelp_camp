'use strict';
const bodyParser = require('body-parser');
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
const port = app.get('port');

let campgrounds = [
		{name: 'Salmon Creek' , image: 'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg'},
		{name: 'Granite Hill', image:'https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg'},
		{name: 'Mountain Goats Rest', image: 'https://farm5.staticflickr.com/4100/4814089244_feda3fd1fb.jpg'},

];

app.get('/' , (req, res, next) => {
	res.render("landing");
});

app.get('/campgrounds', (req, res, next) => {
	res.render('campgrounds', {campgrounds: campgrounds});
});

app.get('/campgrounds/new', (req, res, next) => {
	res.render('new');
});

app.post('/campgrounds', (req, res, next) => {
	//get data from the form and add  to campground array
	let name = req.body.name;
	let image = req.body.image;
	let newCampground = {name:name , image: image};
	campgrounds.push(newCampground);
	//redirect back to the campground route
	res.redirect('/campgrounds');
})

app.listen(port, () => {
	console.log('Server running on port: ', port);
});