var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment");

mongoose.connect("mongodb://localhost/yelp_camp_v4", {useMongoClient: true}, function(){
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
            res.render("campgrounds/index", {campgrounds:allcampgrounds});
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
   res.render("campgrounds/new"); 
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
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });

});


// ==================================
//COMMENTS ROUTES
//===================================
app.get("/campgrounds/:id/comments/:new", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create a new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp Server has started!");
});