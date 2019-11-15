//packages
var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Collection  = require("../models/collection");
var SubGroup 	= require("../models/subgroup");
var middleware  = require("../middleware");


//*************************************//
//          Collection Routes          //
//*************************************//


//INDEX - Show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from db
    Collection.find({}, function(err, allCollections){
        if(err){
            console.log(err);
        }else{
            res.render("collection/index", {collection: allCollections});
        }
    });
});


//SHOW - shows a collection and all subgroups
router.get("/:id", function(req, res){
    //find the collection with the provided ID
    Collection.findById(req.params.id).populate("subgroups").exec(function(err, foundCollection){
        if(err){
            console.log(err);
        }else{
            //render show template with that collection
            res.render("collection/show", {collection:foundCollection});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCollectionOwnership, function(req, res){
    Collection.findById(req.params.id, function(err, foundCollection){
            res.render("collection/edit", {collection: foundCollection}); 
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
   //find and update the correct campground
   Collection.findByIdAndUpdate(req.params.id, req.body.collection, function(err, updatedCollection){
       if(err){
           res.redirect("/collection");
       } else {
           res.redirect("/collection/" + req.params.id);
       }
   });
});


//*************************************//
//          SubGroup Routes            //
//*************************************//

//NEW - show form to create a new subgroup
router.get("/:id/subgroup/new", middleware.isLoggedIn, function(req, res){
   res.render("subgroup/new"); //probably need to pass in id here
});

//SHOW - show cards in the specific subgroup
router.get("/:id/subgroup/:id2", function(req, res){
    //find the subgroup with the provided ID
    SubGroup.findById(req.params.id2 (function(err, foundSubGroup){
        if(err){
            console.log(err);
        }else{
            //render show template with that subgroup
            res.render("subgroup/show", {subgroup:foundSubGroup});
        }
    });
});

//EDIT subgroup 
router.get("/:id/subgroup/:id2/edit", middleware.checkSubGroupOwnership, function(req, res){
    SubGroup.findById(req.params.id2, function(err, foundSubGroup){
            res.render("subgroup/edit", {subgroup: foundSubGroup}); 
    });
});

//UPDATE subgroup 
router.put("/:id/subgroup/:id2", function(req, res){
   //find and update the correct subgroup
   SubGroup.findByIdAndUpdate(req.params.id2, req.body.subGroup, function(err, updatedSubGroup){
       if(err){
           res.redirect("/collection/"+req.params.id);
       } else {
           res.redirect("/collection/"+req.params.id+"/subgroup/"+req.params.id2);
       }
   });
});
	
//DESTROY subgroup
router.delete("/:id/subgroup/:id2", function(req, res){
    SubGroup.findByIdAndRemove(req.params.id2, function(err){
       if(err){
           res.redirect("/collection/"+req.params.id);
       } else {
           res.redirect("/collection/"+req.params.id);
       }
    });
});


module.exports = router;