const express = require("express");
const multer = require("multer");
const Attribute = require("../models/attribute");
const router = express.Router();
const ProductType = require("../models/productType");

//multer memory config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.fields([]), async (req, res) => {
  try {
    let attributes;
    Array.isArray(req.body.attributes)
      ? (attributes = [...req.body.attributes])
      : (attributes = [req.body.attributes]);
    ProductType.create(
      {
        name: req.body.name,
        attributes: attributes,
      },
      (err, doc) => {
        err && console.log(err);
        const { _id } = doc.toObject();
        _id && res.json({ msg: "type Added successfully", _id });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
