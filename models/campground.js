'use strict';
const mongoose = require('mongoose');

//Schema setup
let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,

});

module.exports = mongoose.model('Campground', campgroundSchema);