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
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);