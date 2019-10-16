//-----------------------------------------//
//                REQUIRES                 //
//-----------------------------------------//
const express = require("express"),
  mongoose = require("mongoose"),
  User = require("./models/user"),
  Card = require("./models/card"),
  bodyParser = require("body-parser"),
  cities = require("cities"), // lib to lookup cities by zip or lat-long
  mtg = require("mtgsdk"), //magic the gathering sdk
  app = express();

//set .ejs as extension for views
app.set("view engine", "ejs");

//use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//serve public assets
app.use(express.static(__dirname + "/public"));

//-----------------------------------------//
//                  TEMP                   //
//-----------------------------------------//
var fs = require("fs");

//-----------------------------------------//
//        MongoDB Atlas CONNECTION         //
//-----------------------------------------//
const connectionString =
  "mongodb+srv://jrescalona:Testing2019@cluster0-e1ig7.mongodb.net/users?retryWrites=true&w=majority";
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

//TODO: create new db for cards only.

//-----------------------------------------//
//                ROUTES                   //
//-----------------------------------------//

//index routes
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/index", function(req, res) {
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
        console.log(err[0].message);
      } else {
        console.log(newUser);
        res.render("index");
      }
    }
  );
});

//-----------------------------------------//
//        POPULATE DB (TEST ONLY)          //
//-----------------------------------------//
app.post("/getCards", (req, res) => {
  mtg.card.all({ name: req.body.categoryName, pageSize: 1 }).on("data", card => {
    Card.create(
      {
        name: card.name,
        imageUrl: card.imageUrl
      },
      function(err, cards) {
        if (err) {
          console.log("Error in cards retrieval:" + err);
        } else {
          console.log(cards);
          res.render("index");
        }
      }
    );
  });
});

//userCards route
var data = fs.readFileSync("./test/data.json");
var decks = JSON.parse(data);
app.get("/userDeck", function(req, res) {
  res.render("userDeck", { decks: decks });
});

app.get("/deck", function(req, res) {
  res.render("deck", { decks: decks });
});

//-----------------------------------------//
//                LISTEN                   //
//-----------------------------------------//
const PORT = process.env.PORT || 5000;
app.listen(PORT, function(res, req) {
  console.log("Server Started on " + PORT);
});
``;
