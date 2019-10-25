var mongoose = require("mongoose");

//SCHEMA SETUP
var collectionSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String;
  },
  cardIds: [String]
});

module.exports = mongoose.model("Collection", collectionSchema);