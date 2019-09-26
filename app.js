var express = require("express"),
  mongoose = require("mongoose"),
  User = require("./models/user"),
  bodyParser = require("body-parser"),
  cities = require("cities"); // lib to lookup cities by zip or lat-long
  colors = require("colors"); //library to use colors for text
app = express();

//set .ejs as extension for views
app.set("view engine", "ejs");
//use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// For Twitter Bot
const Twitter = require('twitter');
const config = require('./config.js');
const T = new Twitter(config);

const params = {
  q: '#software',
  count: 10,
  result_type: 'recent',
  lang: 'en'
}
// End use of twitter bot stuff

//PORT
const PORT = 3000;

//connect to mongoDB Atlas
const connectionString =
  "mongodb+srv://jrescalona:Testing2019@cluster0-e1ig7.mongodb.net/users?retryWrites=true&w=majority";
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });


//index route
app.get("/", function(req, res) {
  res.render("index");
});

//default route
app.get("*", function(req, res) {
  res.render("/index");
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
   colors.setTheme({
    error: red,
    warning: yellow,
   }
});


// Added twitter bot that prints tweets link for #software to console.
T.get('search/tweets', params, (err, data, response) => {
  // If there is no error, proceed
  if(err){
    return console.log(err);
  }

  // Loop through the returned tweets
  const tweetsId = data.statuses
    .map(tweet => ({ id: tweet.id_str }));

  tweetsId.map(tweetId => {
    T.post('favorites/create', tweetId, (err, response) => {
      if(err){
        return console.log(err[0].message);
      }

      const username = response.user.screen_name;
      const favoritedTweetId = response.id_str;
	  console.log(`Favorited: https://twitter.com/${username}/status/${favoritedTweetId}`);

    });
  });
})

// Ended

//default route
app.get("*", function(req, res) {
  res.render("/index");
});

//listen
app.listen(PORT, function(res, req) {
  console.log("Server Started on " + PORT);
});
