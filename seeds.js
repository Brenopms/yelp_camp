'use strict';
const mongoose = require('mongoose');
const Campground = require('/.models/campground');

Campgrounds.remove({}, (error) => {
    if(error){
        console.log(error);
    } else {
        console.log('Campgrounds removed');
    }
})