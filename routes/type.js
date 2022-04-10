const express = require("express");
const multer = require("multer");
const router = express.Router();
const ProductType = require("../models/productType");
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

    await ProductType.updateOne(
      { _id: req.body.id },
      {
        name: req.body.name,
        attributes: attributes,
      }
    )
    res.json({ msg: "product updated" });
  } catch (error) {}
});

module.exports = router;




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
