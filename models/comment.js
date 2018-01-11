'use strict';
const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
}, {usePushEach: true});

module.exports = mongoose.model('Comment', commentSchema);