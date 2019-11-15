//Models
var User = require("../models/user");
var Collection = require("../models/collection");
var SubGroup = require("../models/subgroup");

//MIDDLEWARE object to be sent to other pages
var middlewareObj = {};


//Middleware


//check before a username is edited
middlewareObj.checkUserOwnership = function(req,res, next){
	if(req.isAuthenticated()){
		User.findById(req.params.id, function(err, foundUser){
			if(err){
				res.redirect("back");
			} else {
				//is this the correct user?
				if(foundUser._id.equals(req.user._id)){
					next();
				} else {
					//This is not the correct user
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		//if not already authenticated, redirect
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

//check that a user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


//check that a user owns a collection before editing it
middlewareObj.checkCollectionOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Collection.findById(req.params.id, function(err, foundCollection){
            if(err){
                req.flash("error", "Collection not found");
                res.redirect("back");
            } else {
                //does the user own the collection?
                if(foundCollection.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        //if not, redirect
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//check that a user owns the subgroup
middlewareObj.checkSubGroupOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        SubGroup.findById(req.params.id2, function(err, foundSubGroup){
            if(err){
                req.flash("error", "SubGroup not found");
                res.redirect("back");
            } else {
                //does the user own the campground?
                if(foundSubGroup.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        //if not, redirect
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


module.exports = middlewareObj;