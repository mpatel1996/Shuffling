// PACKAGES
const express = require("express"),
  router = express.Router(),
  mtg = require("mtgsdk"),
  Card = require("../models/card"),
  mongoose = require("mongoose"),
  db = require("../config/db_keys");

const userName = "Fuh";
global.addedCards = [];
global.searchResults = [];

// FOR READING TESTING DATA //
var fs = require("fs");
var data = fs.readFileSync("./test/data.json");
var decks = JSON.parse(data);
// CONNECT TO MONGODB ATLAS //
mongoose.connect(db.mongo_uri_users, { useNewUrlParser: true, useUnifiedTopology: true });

// GET REQUESTS //
router
  .get("/", (req, res) => {
    res.render("dashboard", { userName: userName });
  })
  .get("/userDecks", function(req, res) {
    res.render("userDecks", { decks: decks });
  })
  .get("/testCollection", (req, res) => {
    res.render("testCollection");
  });

// POST REQUESTS //
router
  .post("/testCollection", (req, res, next) => {
    let query = req.body.searchkey;
    mtg.card.where({ supertypes: query }).then(cards => {
      console.log(cards[0].name);
    });
  })
  .post("/editCollection", (req, res, next) => {
    searchCards(req.body.searchKey, res);
  })
  .post("/editCollection/addCards", (req, res, next) => {
    addCard(req.body.id);
  })
  .post("/editCollection/removeCards", (req, res, next) => {
    console.log("Removing " + req.body.id);
    removeCard(req.body.id);
  });

// FUNCTIONS : needs refactoring//
async function addCard(id) {
  // id.trim();
  let result = searchResults[0].find(card => {
    console.log("card id:" + card.id);
    console.log("id :" + id);
    console.log(card);
    //console.log(card.name + ":" + card.id + "===" + id);
    return id.localeCompare(card.id) === 0; //TODO: something wrong with compare
  });
  addedCards.push(result);
}

async function removeCard(id) {
  addedCards = Array.from(
    addedCards.filter(card => {
      //console.log(card.id.localeCompare(id));
      return card.id.localeCompare(id) !== 1;
    })
  );

  console.log("Filtered Card set: " + addedCards);
}

async function searchCards(key, res) {
  let promise = mtg.card.where({ name: key }).then(cards => {
    return cards;
  });
  let cards = await promise;
  searchResults.length = 0; //reinit searchResults array
  searchResults.push(cards);
  res.render("editCollection", { cards: cards, addedCards: addedCards });
}

module.exports = router;

// cards.map((card) => {
// Card.create(
//   {
//     name: card.name,
//     manaCost: card.manaCost,
//     rarity: card.rarity,
//     imageUrl: card.imageUrl,
//     text: text
//   }
// )
// })
