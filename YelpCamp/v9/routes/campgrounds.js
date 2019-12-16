var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground");

//INDEX ROUTE - SHOW ALL CAMPGROUNDS--------------------------------------------

router.get("/", function(req, res){
    //Get Campground form DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }
    });
});

// CREATE ROUTE - ADD NEW CAMPGROUND--------------------------------------------

router.post("/", isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description:desc, author:author};
    //campgrounds.push(newCampground); using DB now; Create new CG and save it to DB!
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE - SHOW FORM TO SUBMIT NEW CAMPGROUND-------------------------------

router.get("/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW ROUTE - Shows info about selected CG---------------------------------

// this one have to come after campgrounds/new because it can overwrite the new route
//resulting in new route not opening
router.get("/:id", function(req, res){
    //find the CG with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
           //render show template with that CG
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });

});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;