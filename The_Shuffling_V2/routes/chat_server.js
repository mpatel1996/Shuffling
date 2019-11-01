//packages
var express = require("express");
var router = express.Router();
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

router.get("/", (req, res) => {
  console.log("shite");
  res.render("global_chat");
});

//listen on every connection
io.on("connection", socket => {
  console.log("New user connected");

  //default username
  socket.username = "Anonymous";

  //listen on change_username
  socket.on("change_username", data => {
    socket.username = data.username;
  });

  //listen on new_message
  socket.on("new_message", data => {
    //broadcast the new message
    io.sockets.emit("new_message", { message: data.message, username: socket.username });
  });

  //listen on typing
  socket.on("typing", data => {
    socket.broadcast.emit("typing", { username: socket.username });
  });
});

// http.listen(3000, function() {
//   console.log("listening on *:3000");
// });

module.exports = router;
