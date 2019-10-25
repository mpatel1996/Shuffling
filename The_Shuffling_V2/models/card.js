var mongoose = require("mongoose");

//SCHEMA SETUP
var cardSchema = new mongoose.Schema({
    name: String,
    manaCost: String,
    rarity: String,
    imageUrl: String,
    text: String
});

module.exports = mongoose.model("Card", cardSchema);