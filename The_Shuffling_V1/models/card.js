var mongoose = require("mongoose");

var cardSchema = new mongoose.Schema({
  name: String,
  cmc: String,
  rarity: String,
  imageUrl: String
});

module.exports = mongoose.model("Card", cardSchema);
