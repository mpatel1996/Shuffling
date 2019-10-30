// PACKAGES
const express = require("express"),
  router = express.Router(),
  mtg = require("mtgsdk"),
  Card = require("../models/card"),
  mongoose = require("mongoose"),
  db = require("../config/db_keys");

global.cards = {};

// FOR READING TESTING DATA //
var fs = require("fs");
var data = fs.readFileSync("./test/data.json");
var decks = JSON.parse(data);
// CONNECT TO MONGODB ATLAS //
mongoose.connect(db.mongo_uri_users, { useNewUrlParser: true, useUnifiedTopology: true });

router.get("/userDecks", function(req, res) {
  res.render("userDecks", { decks: decks });
});

router
  .get("/testCollection", (req, res) => {
    res.render("testCollection");
  })
  .post("/testCollection", (req, res) => {
    let query = req.body.searchkey;
    mtg.card.where({ supertypes: query }).then(cards => {
      console.log(cards[0].name);
    });
  });

const userName = "Fuh";
let addedCards = [];
global.searchedCards = [];

router
  .get("/", (req, res) => {
  res.render("dashboard", {userName: userName});
  })

router
    .get("/editCollection/addCard/:id", (req,res)=> {
      console.log(req.param.id)
      addedCards.push(searchedCards.filter((card)=> card.id == req.params.id));
      res.render("editCollection", {cards: searchedCards, addedCards:addedCards})
    })
    .post("/editCollection/removeCard/:id", (req,res)=> {
      addedCards = addedCards.filter((card) => card != req.params.id);
      console.log(addedCards);
      res.render("editCollection", {cards: searchedCards, addedCards:addedCards})
    })
    .post("/editCollection", (req, res) => {
      console.log("Search for " + req.body.searchKey);
      searchCards(req.body.searchKey, res);
    });

async function searchCards(key, res) {
  let promise = mtg.card.where({ name: key }).then(cards => {
    return cards;
  });
  let cards = await promise;
  searchedCards = cards;
  res.render("editCollection", {cards: cards, addedCards:addedCards});
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
