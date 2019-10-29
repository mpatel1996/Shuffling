// Packages
var express = require("express");
var router = express.Router();

//FOR READING TESTING DATA
var fs = require("fs");
var data = fs.readFileSync("./test/data.json");
var decks = JSON.parse(data);

router.get("/", function(req, res) {
  res.render("dashboard", { userName: "Foo" });
});

router.get("/userDecks", function(req, res) {
  res.render("userDecks", { decks: decks });
});

router.get("/deck", function(req, res) {
  res.render("deck");
});

module.exports = router;
