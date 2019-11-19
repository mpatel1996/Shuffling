var mongoose = require("mongoose");

//SCHEMA SETUP
var CardCollectionSchema = new mongoose.Schema({
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
		},
		username: String
    },
	subgroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubGroup"
        }
    ]
});

module.exports = mongoose.model("CardCollection", CardCollectionSchema);