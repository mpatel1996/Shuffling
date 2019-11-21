//================================================//
//         npm Packages                          //
//==============================================//
//keep the order

var mongoose              = require("mongoose"),
	flash				  = require("connect-flash"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	User                  = require("./models/user"),
	LocalStrategy         = require("passport-local"),
	methodOverride        = require("method-override"),
	passportLocalMongoose = require("passport-local-mongoose"),
	express               = require("express"),
	app                   = express();

//require routes
var indexRoutes       = require("./routes/index");
var collectionRoutes  = require("./routes/collection");

//configure mongoose
mongoose.connect("mongodb://localhost/the_shuffling", { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false });


//configre view engine
app.set("view engine","ejs");

//pathing to correct public file
app.use(express.static(__dirname + "/public"));
//method override for post
app.use(methodOverride("_method"));

//authentication stuff
app.use(require("express-session")({
	//statement used to encode the session
	secret: "You are the sun, we are the moon",
	resave: false,
	saveUninitialized: false
}));

//set up passport to work in application
app.use(passport.initialize());
app.use(passport.session());

//read the session, take data and decode it..... then encode it and put it back in the session 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//serve public files
app.use(express.static("public"));

// support json encoded bodies
app.use(bodyParser.json());

//parses info from the body of a page
app.use(bodyParser.urlencoded({extended: true}));

//initialize flash for flash messages
app.use(flash());

//middleware used in every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//import routes
app.use("/", indexRoutes);
app.use("/collection", collectionRoutes);


//Default Route   - sends to index page, keep this route last
app.get("/*", function(req, res){
	res.redirect("/");
});



//socket.io instantiation
//const io = require("socket.io")(server)
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//listen on every connection
io.on('connection', (socket) => {
	//console.log('New user connected')

	//default username
	socket.username = "Anonymous";

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})
// end of chat


//listen or start server
http.listen(3000, function(){
	console.log("Server is listening on port 3000.....");
});