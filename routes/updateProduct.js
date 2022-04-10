const express = require("express");
const multer = require("multer");
const Attribute = require("../models/attribute");
const router = express.Router();
const Product = require("../models/product");

//multer memory config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.fields([]), async (req, res) => {
  try {
    let attributes;
    Array.isArray(req.body.attributes)
      ? (attributes = [...req.body.attributes])
      : (attributes = [req.body.attributes]);
    console.log(req.body);

    await Product.updateOne(
      { _id: req.body.id },
      {
        name: req.body.name,
        productType: req.body.type,
        assignedAttributes: req.body.attributes,
      }
    )
    res.json({ msg: "product updated" });
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
