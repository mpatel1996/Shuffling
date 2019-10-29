//packages
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//test route
router.get("/testCollection", function (req, res) {
	res.render("testCollection");
});



module.exports = router;