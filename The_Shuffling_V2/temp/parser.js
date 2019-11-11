
const db_keys = require("../config/db_keys");
const Card = require("../models/card");
const mongoose = require('mongoose');
const fs = require('fs');

// CONNECT TO MONGODB ATLAS //
mongoose.connect(db_keys.mongo_uri_users, { useNewUrlParser: true, useUnifiedTopology: true });
var start = 0;
var  allCollections = [];
var size = 100;
Card.find({}, (err, data) => {
    if (err) {
      console.log("ERROR" + err);
      res.status(500).send();
    } else {
       for (let i = 0; i < 20; i++) {
            allCollections.push({_id:i, name:"Collection " + i, cards:[] });
            for (let j = start; j < data.length && j < start + size; j++) {
                console.log(start + size);
                allCollections[i].cards.push(data[j]);             
            }
            start += size + 1;
       }
       fs.writeFileSync("./testCollection.json", JSON.stringify(allCollections), err => {console.log(err)}, console.log("Success!"))
    }
  });