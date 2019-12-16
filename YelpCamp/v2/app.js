var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog=demo", {useMongoClient: true}, function(){
    mongoose.connection.dropDatabase();});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// CAMPGROUND SCHEMA SETUP  ----------------------------------------
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//---------------------------------------------------------------------------------------
//v1 array and data creation
// Campground.create(
//     {
//         name: "Salmon Creek", 
//         image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//         description: "New campground with beautiful scenery!!!"
        
//     }, function(err,campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("NEW CAMPGROUND!");
//             console.log(campground);
//         }
//     });

// var campgrounds = [
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
// ];
//-----------------------------------------------------------------------------------------------

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
    // Campground.create(newCampground, function(err, newlyCreated){
    //     if(err){<
    //         console.log(err);
    //     } else {
    //         //redirect back to campgrounds page
    //         res.redirect("/campgrounds");
    //     }
    // });
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
    Campground.findById(req.params.id, function(err, foundCampground){
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