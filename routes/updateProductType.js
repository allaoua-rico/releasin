const express = require("express");
const multer = require("multer");
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
