//packages
var express     	= require("express");
var router      	= express.Router();
var passport    	= require("passport");
var User        	= require("../models/user");
var CardCollection  = require("../models/cardcollection");
var SubGroup 		= require("../models/subgroup");
var middleware  	= require("../middleware");
var mtg				= require("mtgsdk")


//*************************************//
//          Collection Routes          //
//*************************************//


//INDEX - Show all collections
router.get("/", function(req, res){
    //Get all collections from db
    CardCollection.find({}, function(err, allCardCollections){
        if(err){
            console.log(err);
        }else{
            res.render("collection/index", {allcollections: allCardCollections});
        }
    });
});


//SHOW - shows a collection and all subgroups
router.get("/:id", function(req, res){
    //find the collection with the provided ID
    CardCollection.findById(req.params.id).populate("subgroups").exec(function(err, foundCardCollection){
        if(err){
            console.log(err);
        }else{
            //render show template with that collection
            res.render("collection/show", {collection:foundCardCollection, currentUser:req.user});
        }
    });
});

//EDIT collection ROUTE
router.get("/:id/edit", middleware.checkCollectionOwnership, function(req, res){
    CardCollection.findById(req.params.id, function(err, foundCardCollection){
            res.render("collection/edit", {collection: foundCardCollection}); 
    });
});

//UPDATE collection ROUTE
router.put("/:id", function(req, res){
   //find and update the correct collection
   CardCollection.findByIdAndUpdate(req.params.id, req.body.collection, function(err, updatedCardCollection){
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
router.get("/:id/subgroup/new", middleware.checkCollectionOwnership, function(req, res){
   res.render("subgroups/new");
});

//CREATE - create a new subgroup, starting with the name
router.post("/:id/subgroup", middleware.checkCollectionOwnership, function(req,res){
	//get subgroup name from the form and author from the req
	var author = {
        id: req.user._id,
        username: req.user.username
    }
	//create the new subgroup
	subgroup = new SubGroup({
		author: author,
		name: req.body.name
	});
	subgroup.save();
	//add the subgroup id to the collection
	CardCollection.findByIdAndUpdate( req.params.id, { $push: {"subgroups": subgroup}},
									 {safe: true, upsert:true}, function(err){ console.log(err)} );
	//send them to add cards to the subgroup
	res.redirect("/collection/"+req.params.id+"/subgroup/"+subgroup._id+"/add");
});

//SHOW - show cards in the specific subgroup
router.get("/:id/subgroup/:id2", function(req, res){
    //find the subgroup with the provided ID
    SubGroup.findById(req.params.id2, function(err, foundSubGroup){
        if(err){
            console.log(err);
        }else{
            //render show template with that subgroup
            res.render("subgroups/show", {subgroup:foundSubGroup});
        }
    });
});


//NEW - show form to add cards
router.get("/:id/subgroup/:id2/add", middleware.checkSubGroupOwnership, function(req,res){
	SubGroup.findById(req.params.id2, function(err, foundSubGroup){
		res.render("subgroups/add", { subgroup: foundSubGroup, searchResults: [] });
    });
});

//UPDATE the subgroup
router.post("/:id/subgroup/:id2/add", middleware.checkSubGroupOwnership, function(req, res){
	//console.log(req.body.addedCards);
	addThese = req.body.addedCards;
   //find and update the correct subgroup
   SubGroup.findById(req.params.id2, function(err, foundSubGroup){
       if(err){
           res.redirect("/collection/"+req.params.id);
       } else {
		   addThese.forEach(function(card){
			  foundSubGroup.cards.push(card); 
		   });
			foundSubGroup.save();
           res.redirect("/collection/"+req.params.id+"/subgroup/"+req.params.id2);
       }
   });
});

//EDIT subgroup 
router.get("/:id/subgroup/:id2/edit", middleware.checkSubGroupOwnership, function(req, res){
    SubGroup.findById(req.params.id2, function(err, foundSubGroup){
            res.render("subgroups/edit", {subgroup: foundSubGroup}); 
    });
});

//EDIT the subgroup
router.post("/:id/subgroup/:id2/edit", middleware.checkSubGroupOwnership, function(req, res){
	console.log(req.body.addedCards);
	newSubgroup = req.body.addedCards;
   //find and update the correct subgroup
   SubGroup.findById(req.params.id2, function(err, foundSubGroup){
       if(err){
           res.redirect("/collection/"+req.params.id);
       } else {
			foundSubGroup.cards = newSubgroup; 
			foundSubGroup.save();
           res.redirect("/collection/"+req.params.id+"/subgroup/"+req.params.id2);
       }
   });
});
	
//DESTROY subgroup
router.delete("/:id/subgroup/:id2", middleware.checkSubGroupOwnership, function(req, res){
	//remove pointer to subgroup from collection
	CardCollection.findById(req.params.id, function(err, foundCardCollection){
		//console.log(req.params.id2);
		foundCardCollection.subgroups.pull({ _id: req.params.id2});
		foundCardCollection.save();
	});
	//delete the subgroup from the database
    SubGroup.findByIdAndRemove(req.params.id2, function(err){
       if(err){
           res.redirect("/collection/"+req.params.id);
       } else {
           res.redirect("/collection/"+req.params.id);
       }
    });
});

//SEARCH - mtg
router.post("/:id/subgroup/:id2/searchCard", middleware.checkSubGroupOwnership, async function(req,res) {
	var searchResults  = await searchMtg(req.body.searchKey);
	//res.redirect("/collection/"+req.params.id+"/subgroup/"+req.params.id2+"/add");
	SubGroup.findById(req.params.id2, function(err, foundSubGroup){
		res.render("subgroups/add", { subgroup: foundSubGroup, searchResults: searchResults});
    });
})


// FUNCTIONS
async function searchMtg(key) {
	console.log("Searching for " + key);
  let data = mtg.card
    .where({ name: key })
    .then(cards => {
      return cards;
    })
    .catch(err => console.log(err));
  return data;
}

module.exports = router;