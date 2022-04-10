const express = require("express");
const multer = require("multer");
const Attribute = require("../models/attribute");
const router = express.Router();
const ProductType = require("../models/productType");
const Product = require("../models/product");
const AssignedAttribute = require("../models/assignedAttribute");

//multer memory config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
