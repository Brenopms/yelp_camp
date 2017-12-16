'use strict';
const mongoose = require('mongoose');

//Schema setup
let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]

}, {usePushEach: true});

module.exports = mongoose.model('Campground', campgroundSchema);