'use strict';
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

let data = [
    {
        name: 'Clouds rest',
        image:'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg',
        description: `  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        `
    },
    {
        name: 'Snow rest',
        image:'https://farm3.staticflickr.com/2866/9633983432_f8f0d82a88.jpg',
        description: `  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        `
    },
    {
        name: 'Sunset sea',
        image:'https://farm3.staticflickr.com/2587/3918023295_7e6e22c1e6.jpg',
        description: `  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis magni accusamus provident natus laborum corrupti commodi assumenda, tempora omnis iusto earum odio perferendis nihil incidunt molestiae est autem et consequuntur?
        `
    }

]

//CALBACK HELL
function  seedDB(){
    //Remove all campgrounds
    Campground.remove({}, (error) => {
        if(error){
            console.log(error);
        } else {
            console.log('Campgrounds removed');
            //add a few campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (error, campground) => {
                    if(error){
                        console.log(error);
                    } else {
                        console.log('Added campground');
                        //create a comment
                        Comment.create({
                            text: 'This place is great but I wish it had internet',
                            author: 'Homer'
                        }, (error, comment) => {
                            if(error) {
                                console.log(error);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log('Created campground');
                            }
                        });
                    }
                });
            });
        }
    });

}

module.exports = seedDB;