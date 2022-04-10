const express = require("express");
const multer = require("multer");
const router = express.Router();
const ProductType = require("../models/productType");
const Product = require("../models/product");
const AssignedAttribute = require("../models/assignedAttribute");
const Attribute = require("../models/attribute");

//multer memory config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put("/", upload.fields([]), async (req, res) => {
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


router.post("/", upload.fields([]), async (req, res) => {
  try {
    console.log(req.body);

    let attributes;
    Array.isArray(req.body.attributes)
      ? (attributes = [...req.body.attributes])
      : (attributes = [req.body.attributes]);

    Product.create(
      {
        name: req.body.name,
        productType: req.body.type,
        assignedAttributes: attributes,
      },
      (err, doc) => {
        err && console.log(err);
        console.log(doc.toObject());
        const { _id } = doc.toObject();
        _id && res.json({ msg: "Product Added successfully", _id });
      }
    );
  } catch (error) {}
});

module.exports = router;
