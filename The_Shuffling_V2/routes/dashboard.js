// PACKAGES
const express = require("express"),
  router = express.Router(),
  mtg = require("mtgsdk"),
  Card = require("../models/card"),
  Group = require("../models/card_group"),
  mongoose = require("mongoose"),
  db_keys = require("../config/db_keys");

// ROUTES //
// require routes
const allCollectionsRoutes = require("./allCollections");
// set routes
router.use("/allCollections", allCollectionsRoutes);

// FOR READING TESTING DATA //
var fs = require("fs");
var data = fs.readFileSync("./temp/data.json");
var decks = JSON.parse(data);

// CONNECT TO MONGODB ATLAS //
mongoose.connect(db_keys.mongo_uri_users, { useNewUrlParser: true, useUnifiedTopology: true });

// GET REQUESTS //
router
  .get("/", (req, res) => {
    //render available groupings
    searchResults = []; //initialize searchResults
    addedCards = []; //initialize addedCards
    // get decks
    res.render("dashboard");
  })
  .get("/allCards", (req, res) => {
    Card.find((err, cards) => {
      if (err) {
        console.log(err);
      } else {
        currentCollection = cards.slice();
        res.render("dashboard", { cards: cards });
      }
    });
  })

// POST REQUESTS //
router.post("/testCollection", (req, res, next) => {
  let query = req.body.searchkey;
  mtg.card.where({ supertypes: query }).then(cards => {});
});

// TEMPORARY ROUTE(S) //
router.post("/populate", (req, res) => {
  mtg.card.where({ name: req.body.searchKey }).then(birds => {
    birds.map(card => {
      Card.create({
        id: card.id,
        name: card.name,
        manaCost: card.cmc,
        rarity: card.rarity,
        imageUrl: card.imageUrl,
        text: card.text
      });
    });
  });
  res.redirect("/");
});

module.exports = router;
