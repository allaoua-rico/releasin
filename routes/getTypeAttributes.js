const express = require("express");
const ProductType = require("../models/productType");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    req.query.id.length>0 && ProductType.findOne({_id:req.query.id})
      .populate("attributes")
      .then((docs) => res.json(docs.attributes));
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
