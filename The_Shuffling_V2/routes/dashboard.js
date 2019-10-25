// Packages
var express = require("express");
var router = express.Router();
const mtg = require("mtgsdk");
const Card = require("../models/card");

//FOR READING TESTING DATA
var fs = require("fs");
var data = fs.readFileSync("./test/data.json");
var decks = JSON.parse(data);

router.get("/", (req, res) => {
  var userName = "Fuh"
  res.render("dashboard", { userName: userName });
});

router.get("/userDecks", function (req, res) {
  res.render("userDecks", { decks: decks });
});

router.get("/testCollection", (req, res) => {
  res.render("testCollection");
})

// TEST QUERY //
router.post("/testCollection", (req, res) => {
  let query = req.body.searchkey;
  var promise = mtg.card.where({ supertypes: query });
  promise.then(cards => {
    console.log(cards);
  });
})

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