const express = require("express");
// const multer = require("multer");
const Attribute = require("../models/attribute");
const router = express.Router();
require("../models/attributeValue");
router.get("/", (req, res) => {
  try {
    Attribute.find({})
      .populate("attributeValue")
      .then((docs) => res.json(docs));
  } catch (error) {
    console.log(error);
  }
});
// }
module.exports = router;
