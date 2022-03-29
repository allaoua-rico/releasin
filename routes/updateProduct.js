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

    let idAttributes = [];
    for (let index = 0; index < attributes.length; index++) {
      const { _id } = await Attribute.findOne(
        { name: attributes[index] },
        { _id: 1 }
      );
      idAttributes.push(_id);
    }
    console.log(req.body);

    await Product.updateOne(
      { _id: req.body.id },
      {
        name: req.body.name,
        productType: req.body.type,
        assignedAttributes: idAttributes,
      }
    )
        // .then((doc) => console.log(doc))
      .catch((err) => console.log(err));
    res.json({ msg: "product updated" });
  } catch (error) {}
});

module.exports = router;
