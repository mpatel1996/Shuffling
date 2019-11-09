// PACKAGES
const express = require("express"),
  router = express.Router(),
  mtg = require("mtgsdk"),
  Group = require("../models/card_group");

// Card Containers
var newCards = [];
var searchResults = [];
var collectionId;
var collection;
var allCollections = [
  {
    _id: "1",
    name: "Collection 1",
    cards: [
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b61" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b62" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f215ffb736ce928cc09" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0b" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5403cfcd6b3f659b60" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5403cfcd6b3f659b60" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b61" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f215ffb736ce928cc09" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0a" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0b" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f97a627ab956d71791ca7" },
        name: "Mirri, Cat Warrior",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106405&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f97a627ab956d71791ca9" },
        name: "Phantom Warrior",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=132064&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f981ef5192e6d8964e6bc" },
        name: "Mountain Goat",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4073&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9825f5192e6d8964e6be" },
        name: "Greater Realm of Preservation",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4128&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9825f5192e6d8964e6bf" },
        name: "Greater Realm of Preservation",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4128&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9827f5192e6d8964e6c1" },
        name: "Greater Werewolf",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=3849&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bcc3048a6dd4e4c7a6" },
        name: "Festering Goblin",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129546&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bec3048a6dd4e4c7a7" },
        name: "Goblin Elite Infantry",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130380&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bfc3048a6dd4e4c7a8" },
        name: "Goblin King",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129578&type=card",
        __v: { $numberInt: "0" }
      },
      { _id: { $oid: "5d9fa3a6149302708e7cf3cc" }, name: "Birds of Paradise", __v: { $numberInt: "0" } },
      {
        _id: { $oid: "5d9fa3a9149302708e7cf3cd" },
        name: "Birds of Paradise",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=739&type=card",
        __v: { $numberInt: "0" }
      }
    ]
  },
  {
    _id: "2",
    name: "Collection 2",
    cards: [
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b61" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b62" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f215ffb736ce928cc09" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0b" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5403cfcd6b3f659b60" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5403cfcd6b3f659b60" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b61" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f215ffb736ce928cc09" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0a" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0b" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f97a627ab956d71791ca7" },
        name: "Mirri, Cat Warrior",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106405&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f97a627ab956d71791ca9" },
        name: "Phantom Warrior",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=132064&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f981ef5192e6d8964e6bc" },
        name: "Mountain Goat",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4073&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9825f5192e6d8964e6be" },
        name: "Greater Realm of Preservation",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4128&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9825f5192e6d8964e6bf" },
        name: "Greater Realm of Preservation",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4128&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9827f5192e6d8964e6c1" },
        name: "Greater Werewolf",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=3849&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bcc3048a6dd4e4c7a6" },
        name: "Festering Goblin",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129546&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bec3048a6dd4e4c7a7" },
        name: "Goblin Elite Infantry",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130380&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bfc3048a6dd4e4c7a8" },
        name: "Goblin King",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129578&type=card",
        __v: { $numberInt: "0" }
      },
      { _id: { $oid: "5d9fa3a6149302708e7cf3cc" }, name: "Birds of Paradise", __v: { $numberInt: "0" } },
      {
        _id: { $oid: "5d9fa3a9149302708e7cf3cd" },
        name: "Birds of Paradise",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=739&type=card",
        __v: { $numberInt: "0" }
      }
    ]
  },
  {
    _id: "3",
    name: "Collection 3",
    cards: [
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b61" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b62" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f215ffb736ce928cc09" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0b" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5403cfcd6b3f659b60" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5403cfcd6b3f659b60" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b61" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f215ffb736ce928cc09" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0a" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0b" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f97a627ab956d71791ca7" },
        name: "Mirri, Cat Warrior",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106405&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f97a627ab956d71791ca9" },
        name: "Phantom Warrior",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=132064&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f981ef5192e6d8964e6bc" },
        name: "Mountain Goat",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4073&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9825f5192e6d8964e6be" },
        name: "Greater Realm of Preservation",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4128&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9825f5192e6d8964e6bf" },
        name: "Greater Realm of Preservation",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4128&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9827f5192e6d8964e6c1" },
        name: "Greater Werewolf",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=3849&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bcc3048a6dd4e4c7a6" },
        name: "Festering Goblin",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129546&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bec3048a6dd4e4c7a7" },
        name: "Goblin Elite Infantry",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130380&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bfc3048a6dd4e4c7a8" },
        name: "Goblin King",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129578&type=card",
        __v: { $numberInt: "0" }
      },
      { _id: { $oid: "5d9fa3a6149302708e7cf3cc" }, name: "Birds of Paradise", __v: { $numberInt: "0" } },
      {
        _id: { $oid: "5d9fa3a9149302708e7cf3cd" },
        name: "Birds of Paradise",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=739&type=card",
        __v: { $numberInt: "0" }
      }
    ]
  },
  {
    _id: "4",
    name: "Collection 4",
    cards: [
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b61" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b62" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f215ffb736ce928cc09" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0b" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5403cfcd6b3f659b60" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5403cfcd6b3f659b60" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8d5503cfcd6b3f659b61" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f215ffb736ce928cc09" },
        name: "Squee, Goblin Nabob",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106473&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0a" },
        name: "Squee's Embrace",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26785&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f8f225ffb736ce928cc0b" },
        name: "Squee's Revenge",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=26831&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f97a627ab956d71791ca7" },
        name: "Mirri, Cat Warrior",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=106405&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f97a627ab956d71791ca9" },
        name: "Phantom Warrior",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=132064&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f981ef5192e6d8964e6bc" },
        name: "Mountain Goat",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4073&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9825f5192e6d8964e6be" },
        name: "Greater Realm of Preservation",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4128&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9825f5192e6d8964e6bf" },
        name: "Greater Realm of Preservation",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4128&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f9827f5192e6d8964e6c1" },
        name: "Greater Werewolf",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=3849&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bcc3048a6dd4e4c7a6" },
        name: "Festering Goblin",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129546&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bec3048a6dd4e4c7a7" },
        name: "Goblin Elite Infantry",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130380&type=card",
        __v: { $numberInt: "0" }
      },
      {
        _id: { $oid: "5d9f98bfc3048a6dd4e4c7a8" },
        name: "Goblin King",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129578&type=card",
        __v: { $numberInt: "0" }
      },
      { _id: { $oid: "5d9fa3a6149302708e7cf3cc" }, name: "Birds of Paradise", __v: { $numberInt: "0" } },
      {
        _id: { $oid: "5d9fa3a9149302708e7cf3cd" },
        name: "Birds of Paradise",
        imageUrl: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=739&type=card",
        __v: { $numberInt: "0" }
      }
    ]
  }
];

// GET REQUESTS //
router
.get("/", (req,res)=> {
  console.log(req.body);
  res.render("editCollection", {
    collection: collection,
    searchResults: searchResults,
    newCards: newCards
  });
})
.get("/:id", (req, res, next) => {
  collectionId = req.params.id;
  //allCollections = getTestDataAndParse();
  // filter selected collection
  collection = allCollections.find(c => collectionId.localeCompare(c._id) === 0); //middleware
  //TODO: Search collections using id //middleware
  res.render("editCollection", {
    collection: collection,
    searchResults: searchResults,
    newCards: newCards
  });
})
.get("*", (req,res) => {
  res.redirect("/");
})


.get("/addNewCollection", (req,res) => {
  res.redirect("/dashboard/allCollections/editCollection/")
})

// POST REQUESTS //
router
  .post("/searchCards", async (req, res, next) => {
    let data = await searchMtg(req.body.searchKey);
    searchResults = data.map(card => {
      return {
        id: card.id,
        name: card.name,
        convertedManaCost: card.cmc,
        rarity: card.rarity,
        imageUrl: card.imageUrl,
        text: card.text
      };
    });
    res.redirect("/dashboard/allCollections/editCollection/");
  })
  .post("/addCards", (req, res, next) => {
    let id = req.body.id;
    console.log(id);
    let card = searchResults.find(card => {
      return id.localeCompare(card.id) === 0;
    });
    newCards.push(card);
    res.send({ card: card });
  })
  .post("/removeCards", (req, res, next) => {
    let id = req.body.id;
    newCards = newCards.filter(card => {
      return id.localeCompare(card.id) !== 0;
    });
    res.redirect("/dashboard/allCollections/editCollection/");
  });

// FUNCTIONS //
async function searchMtg(key, res) {
  let data = mtg.card.where({ name: key }).then(cards => {
    return cards;
  });
  return data;
}
var cards;
function getTestDataAndParse() {
  let allCollections = [];
  let start = 0;
  let cards = [];

  Card.find({}, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      cards = data.slice();
    }
  });

  for (let i = 0; i < 10; i++) {
    // parse cards into collections with name and id
    allCollections.push({ _id: i, name: "Collection #" + i, cards: [] });
    for (let j = start; j < start + 60; j++) {
      // push cards to cards array inside allCollections
      allCollections[i].cards.push(cards[j]);
    }
    start += 60;
  }
  return allCollections;
}

module.exports = router;
