var express = require("express"),
  mongoose = require("mongoose"),
  User = require("./models/user"),
  bodyParser = require("body-parser"),
  cities = require("cities"); // lib to lookup cities by zip or lat-long
app = express();

const PORT = 3000;

app.set("view engine", "ejs");

//use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//index route
app.get("/", function(req, res) {
  res.render("index");
});

//handle new user requests
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  //request location from Cities library
  let userAddress = cities.zip_lookup(req.body.zipCode);
  res.send(
    "<h2>Welcome " +
      req.body.firstName +
      " " +
      req.body.lastName +
      "! </h2><h3>from " +
      userAddress.city +
      ", " +
      userAddress.state_abbr +
      "</h3>"
  );

  //TODO: database integration
  let city, state, zipCode, country;
});

//default route
app.get("*", function(req, res) {
  res.render("/index");
});

//listen
app.listen(PORT, function(res, req) {
  console.log("Server Started on " + PORT);
});
