'use strict';
const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    text: String,
    author: String
}, {usePushEach: true});

module.exports = mongoose.model('Comment', commentSchema);