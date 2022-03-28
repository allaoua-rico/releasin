const express = require("express");
const AssignedAttribute = require("../models/assignedAttribute");
const router = express.Router();
require("../models/attributeValue");

router.get("/", (req, res) => {
    console.log('here')
  try {
    AssignedAttribute.find({})
      .populate("attributeValue")
      .then((docs) => console.log(docs));
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
