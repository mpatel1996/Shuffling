const express = require("express");
const router = express.Router();

//temporary HTTP service
router.get("/john-a4", function(req, res) {
  res.send("This is John Escalona. Assingment 4 Done.");
});

module.exports = router;
