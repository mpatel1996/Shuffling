var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	googleId: String, 
	cardcollection: {
		id : {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CardCollection"
		}
	},
	imgUrl: {type:String, default:"https://img.scryfall.com/cards/large/front/9/e/9e80f2fc-06d4-4ce9-b23b-3e4af1208fa5.jpg?1562924504"}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);