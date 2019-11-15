var mongoose = require("mongoose");

//SCHEMA SETUP
var subgroupSchema = new mongoose.Schema({
	name: String,
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
		},
		username: String
    },
	cards: []
});

module.exports = mongoose.model("SubGroup", subgroupSchema);