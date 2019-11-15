//packages
var express = require("express"),
  router = express.Router(),
  passport = require("passport");

var collections = [];

// ROUTES //
const editCollectionRoutes = require("./editCollection");
const newCollectionRoutes = require("./newCollection");
router.use("/editCollection", editCollectionRoutes);
router.use("/newCollection", newCollectionRoutes);

// GET //
router.get("/:id", (req, res) => {
  res.render("allCollection", { collections: collections });
});

module.exports = router;
