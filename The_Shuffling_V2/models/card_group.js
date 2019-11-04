var mongoose = require("mongoose");
var cardSchema = require("./card")

var groupSchema = new mongoose.Schema({
    groupName: String,
    cards: [{type:mongoose.Schema.Types.ObjectId, ref:cardSchema}]
});

module.exports = mongoose.model("Group", groupSchema);