var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp_v3", {useMongoClient: true}, function(){
    mongoose.connection.dropDatabase();});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//seedDB();

app.get("/",  function(req, res){
    res.render("landing");
});

//INDEX ROUTE - SHOW ALL CAMPGROUNDS--------------------------------------------

app.get("/campgrounds", function(req, res){
    //Get Campground form DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds:allcampgrounds});
        }
    });
});

// CREATE ROUTE - ADD NEW CAMPGROUND--------------------------------------------

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description:desc};
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

app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs"); 
});

// SHOW ROUTE - Shows info about selected CG---------------------------------

// this one have to come after campgrounds/new because it can overwrite the new route
//resulting in new route not opening
app.get("/campgrounds/:id", function(req, res){
    //find the CG with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
           //render show template with that CG
            res.render("show", {campground:foundCampground});
        }
    });

});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp Server has started!");
});