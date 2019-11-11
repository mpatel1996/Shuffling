// PACKAGES
const express = require("express"),
  router = express.Router(),
  mtg = require("mtgsdk"),
  fs = require('fs'),
  Group = require("../models/card_group");

// Card Containers
var newCards = [];
var searchResults = [];
var collectionId;
var collection;

// TEMP Collection //
var data = fs.readFileSync("./temp/testCollection.json");
var allCollections = JSON.parse(data);


// GET REQUESTS //
router
  .get("/", (req,res)=> {
    res.render("editCollection", {
      collection: collection,
      searchResults: searchResults,
      newCards: newCards
    });
  })
  .get("/:id", (req, res, next) => {
    //TODO: fetch all user collections from database
    collectionId = req.params.id;
    // filter selected collection
    if(collectionId.localeCompare("new") !== 0) {
      collection = allCollections.find(c => collectionId.localeCompare(c._id) === 0); //middleware
      //TODO: Search collections using id //middleware
    } else {
      collection = [];
    }
    res.redirect("/dashboard/allCollections/editCollection/");
  })
  .get("/*", (req,res) => {
    res.redirect("/dashboard/allCollections/editCollection/");
  })

// POST REQUESTS //
router
  // SEARH CARDS FROM MTG
  .post("/searchCards", async (req, res, next) => {
    let data = await searchMtg(req.body.searchKey);
    searchResults = data.map(card => {
      return {
        id: card.id,
        name: card.name,
        convertedManaCost: card.cmc,
        rarity: card.rarity,
        imageUrl: card.imageUrl,
        text: card.text
      };
    });
    res.redirect("editCollection/");
  })
  // ADD CARDS TO NEWCARDS CONTAINER
  .post("/addCards", (req, res, next) => {
    let id = req.body.id;
    let card = searchResults.find(card => {
      return id.localeCompare(card.id) === 0;
    });
    newCards.push(card);
    res.send({ card: card });
  })
  // REMOVE A CARD FROM NEWCARDS CONTAINER
  .post("/removeCards", (req, res, next) => {
    let id = req.body.id;
    newCards = newCards.filter(card => {
      return id.localeCompare(card.id) !== 0;
    });
    res.redirect("/");
  })
  // RESET NEWCARDS CONTAINER
  .post("/reset", (req, res, next) => {
    let containerName = req.body.containerName;
    console.log(containerName);
    if(containerName == "newCards") {
      newCards.length = 0;
      searchResults.length = 0;
    }  else if(containerName == "collection") {
      collection.length = 0;
      console.log(newCards);
    } else {
      console.log("Error:Container to reset no found!");
    }
    res.redirect("/");
  })
  // ADD CARDS TO DATABASE
  .post("/addCardsToCollection", (req,res) => {
    for (let i = 0; i < newCards.length; i++) {
      collection.cards.push(newCards[i]); //TODO: should add directly to database
    } 
    newCards.length = 0;
    res.redirect("/");
  });

// FUNCTIONS //
async function searchMtg(key, res) {
  let data = mtg.card.where({ name: key }).then(cards => {
    return cards;
  });
  return data;
}

var cards;
function getTestDataAndParse() {
  let allCollections = [];
  let start = 0;
  let cards = [];

  Card.find({}, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      cards = data.slice();
    }
  });

  for (let i = 0; i < 10; i++) {
    // parse cards into collections with name and id
    allCollections.push({ _id: i, name: "Collection #" + i, cards: [] });
    for (let j = start; j < start + 60; j++) {
      // push cards to cards array inside allCollections
      allCollections[i].cards.push(cards[j]);
    }
    start += 60;
  }
  return allCollections;
}

module.exports = router;