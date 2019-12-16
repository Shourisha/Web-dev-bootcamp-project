var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum sed erat sit amet eleifend. Aliquam mattis orci in ipsum auctor malesuada. Etiam vehicula consequat nisl nec bibendum. Nulla posuere tempor volutpat. Donec at arcu facilisis, dapibus magna a, ultrices elit. Praesent lorem eros, tincidunt id ipsum id, hendrerit eleifend mauris. Quisque in suscipit ligula. Integer tincidunt neque ac nunc elementum tempor. Nam vel pharetra enim. Mauris id placerat enim. Cras luctus vitae neque sit amet aliquet."
    },
    {
        name: "Desert Mesa", 
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum sed erat sit amet eleifend. Aliquam mattis orci in ipsum auctor malesuada. Etiam vehicula consequat nisl nec bibendum. Nulla posuere tempor volutpat. Donec at arcu facilisis, dapibus magna a, ultrices elit. Praesent lorem eros, tincidunt id ipsum id, hendrerit eleifend mauris. Quisque in suscipit ligula. Integer tincidunt neque ac nunc elementum tempor. Nam vel pharetra enim. Mauris id placerat enim. Cras luctus vitae neque sit amet aliquet."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum sed erat sit amet eleifend. Aliquam mattis orci in ipsum auctor malesuada. Etiam vehicula consequat nisl nec bibendum. Nulla posuere tempor volutpat. Donec at arcu facilisis, dapibus magna a, ultrices elit. Praesent lorem eros, tincidunt id ipsum id, hendrerit eleifend mauris. Quisque in suscipit ligula. Integer tincidunt neque ac nunc elementum tempor. Nam vel pharetra enim. Mauris id placerat enim. Cras luctus vitae neque sit amet aliquet."
    }
];

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Campgrounds");
        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if (err){
                    console.log(err);
                } else {
                    console.log("Added a campground!");
                    // create a commnet
                    Comment.create({
                        text: "This place is awesome!",
                        author: "Homer"
                    }, function(err, comment){
                        if (err){
                            console.log(err);
                        } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;