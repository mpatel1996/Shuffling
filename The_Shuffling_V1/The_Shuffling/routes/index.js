//packages
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//Index route - home page
router.get("/", function(req, res) {
  res.render("index", { currentUser: req.user });
});

//secret page, temporary for testing only
router.get("/secret", middleware.isLoggedIn, function(req, res) {
  res.render("secret");
});

//AUTH Routes
//show signup form
router.get("/register", function(req, res) {
  res.render("register");
});
//handling user sign up
router.post("/register", function(req, res) {
  //registering a new user
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
    //if error then return user to register page
    if (err) {
      console.log(err);
      return res.render("register");
    }
    //otherwise send to secret page
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "You are the sun, We are the moon");
      res.redirect("/secret");
    });
  });
});


// LOGIN ROUTES
//render login form
router.get("/login", function(req, res) {
  res.render("login", { message: req.flash("error") });
});
//login logic     passport.authenticate part is middleware
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

//logout logic
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/");
});

module.exports = router;
