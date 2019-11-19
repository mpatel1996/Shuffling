//packages
var express     	= require("express"),
    router      	= express.Router(),
    passport    	= require("passport"),
	GoogleStrategy 	= require("passport-google-oauth").OAuth2Strategy,
    User        	= require("../models/user"),
	CardCollection  = require("../models/cardcollection"),
    middleware  	= require("../middleware");

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: ""
  },
  function(accessToken, refreshToken, profile, done) {
	//check if there is a user with the google id
	User.findOne({
		'googleId':profile.id
	}, function(err, user){
		//if error
		if(err){
			return done(err);
		}
		//No user was found, create a new user with values from Google Sign in
		if(!user){
			//first create the user with no collection
			user = new User({
				username: 'User#'+profile.id.substring(1,5),
				googleId: profile.id,
			});
			//get the user's mongo object id
			var author = {
				id: user._id,
				username: user.username
			}
			//create a collection for the user
			cardcollection = new CardCollection({
				author: author,
				subgroups: []
			});
			cardcollection.save();
			
			//give the user the id of the collection
			user.cardcollection.id = cardcollection._id;
			//
			user.save(function(err){
				if(err) console.log(err);
				return done(err, user);
			});
		} else {
			//found user, return
			//console.log("Returning profile:"+profile.id);
			return done(err,user);
		}
	});
  }
));

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback', 
  passport.authenticate('google', {failureRedirect: '/login' }),
  function(req, res) {
	req.flash("success", "Logged you in!");
	res.redirect("/collection/"+req.user.cardcollection.id);
});

//Index route - home page
router.get("/", function(req,res){
	res.render("index", {currentUser: req.user});
});

router.get("/error", function(req,res){
	res.render("error",{currentUser: req.user});
});


//secret page, temporary for testing only
router.get("/secret",middleware.isLoggedIn, function(req,res){
	res.render("secret", {currentUser: req.user});
});

//AUTH Routes

// LOGIN ROUTES
//render login form
router.get("/login", function(req, res){
	res.render("login", {message: req.flash("error")});	
});

//show user's profile
router.get("/profile", middleware.isLoggedIn, function(req,res){
	res.render("profile", {currentUser: req.user});
});

//edit user profile
router.get("/profile/:id/edit", middleware.checkUserOwnership, function(req,res){
	res.render("edit", {currentUser: req.user});
});

//update user profile
router.put("/profile/:id/edit", function(req,res){
	var newUsername = req.body.username+"#"+req.params.id.substring(req.params.id.length-4,req.params.id.length);
	console.log(newUsername);
	//find and update the correct user
	User.findByIdAndUpdate(req.params.id, {username : newUsername}, {new:true}, function(err, updatedUser){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			//also update the collection author name
			console.log(updatedUser.cardcollection.id);
			CardCollection.findById(updatedUser.cardcollection.id, function(err, foundCardCollection){
				foundCardCollection.author.username = newUsername;
				foundCardCollection.save();
			});
			//relog the user in
			res.redirect("/auth/google");
		}
	});
})

//logout logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
});


module.exports = router;