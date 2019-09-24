
//This is an example of get and post requests
var express= require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");


var friends = ["Brett", "Kyle", "Kevin", "Thunan", "Hector", "Victor"];

app.get("/", function(req, res){
    res.render("home");
});

app.get("/friends", function(req, res){
    res.render("friends", {friends: friends});
});

app.post("/addfriend", function(req, res){
    var newFriend = req.body.newfriend;
    friends.push(newFriend);
    // res.send("You have reached the post route!");
    res.redirect("/friends");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started");
});