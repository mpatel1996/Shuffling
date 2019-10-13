var mongoose = require("mongoose");

var cardSchema = new mongoose.Schema({
  name: String,
  imageUrl: String
});

module.exports = mongoose.model("Card", cardSchema);
