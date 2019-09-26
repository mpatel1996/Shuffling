var express = require("express"),
  mongoose = require("mongoose"),
  User = require("./models/user"),
  bodyParser = require("body-parser"),
  cities = require("cities"); // lib to lookup cities by zip or lat-long
app = express();

const PORT = 3000;
const connectionString =
  "mongodb+srv://jrescalona:Testing2019@cluster0-e1ig7.mongodb.net/users?retryWrites=true&w=majority";

//connect to mongoDB
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

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
  User.create(
    {
      userFirstName: req.body.firstName,
      userLastName: req.body.lastName,
      city: userAddress.city,
      state: userAddress.state,
      zipCode: userAddress.zipcode
    },
    function(err, newUser) {
      if (err) {
        res.send("You flocked up!\n" + err);
      } else {
        res.redirect("index");
      }
    }
  );
});

//default route
app.get("*", function(req, res) {
  res.render("/index");
});

//listen
app.listen(PORT, function(res, req) {
  console.log("Server Started on " + PORT);
});
