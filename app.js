const express = require("express");
const app = express();
const PORT = 3001;

//require routes
const indexRoutes = require("./routes");

//import routes
app.use(indexRoutes);

//listen or start server
app.listen(PORT, function() {
  console.log("Server is listening on port " + PORT);
});
