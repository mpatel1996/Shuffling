//packages
var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  fs = require("fs");
  

// TEST Collection //
var data = fs.readFileSync("./temp/testCollection.json");
var collections = JSON.parse(data);

// ROUTES //
const editCollectionRoutes = require("./editCollection");
const newCollectionRoutes = require("./newCollection");
router.use("/editCollection", editCollectionRoutes);
router.use("/newCollection", newCollectionRoutes);

// GET //
router.get("/", (req, res) => {
  res.render("allCollection", { collections: collections });
});

module.exports = router;
