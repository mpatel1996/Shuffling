// PACKAGES
const express = require("express"),
  router = express.Router(),
  mtg = require("mtgsdk");

// Card Containers
var searchResults = [];
var collection = {
  name: "New Collection",
  cards: []
};

router.get("/", (req, res) => {
  res.render("newCollection", { collection: collection, searchResults: searchResults });
});

router
  .post("/", (req, res) => {
    collection.name = req.body.name;
    searchResults.length = 0;
    console.log(req.baseUrl);
    res.redirect("newCollection/");
  })
  // SEARH CARDS FROM MTG
  .post("/searchCards", async (req, res, next) => {
    console.log("Search cards url : " + req.url);
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
    res.redirect("/allCollections/newCollection/");
  })
  // ADD CARDS TO NEWCARDS CONTAINER
  .post("/addCards", (req, res, next) => {
    let id = req.body.id;
    let card = searchResults.find(card => {
      return id.localeCompare(card.id) === 0;
    });
    collection.cards.push(card);
    res.send({ card: card });
  })
  // REMOVE A CARD FROM NEWCARDS CONTAINER
  .post("/removeCards", (req, res, next) => {
    let id = req.body.id;
    collection.cards = collection.cards.filter(card => {
      return id.localeCompare(card.id) !== 0;
    });
    res.redirect("/");
  })
  // RESET NEWCARDS CONTAINER
  .post("/reset", (req, res, next) => {
    //empty cards in collection
    collection.cards.length = 0;
    res.redirect("/");
  })
  // TODO: ADD CARDS TO DATABASE
  .post("/addCardsToCollection", (req, res) => {
    res.redirect("/");
  });

// FUNCTIONS //
async function searchMtg(key, res) {
  let data = mtg.card
    .where({ name: key })
    .then(cards => {
      return cards;
    })
    .catch(err => console.log(err));
  return data;
}

module.exports = router;
