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

    const prod = new Product({
      name: req.body.name,
      productType: req.body.type,
      assignedAttributes: idAttributes,
    });
    prod.save().then((doc) => {
      console.log(doc.toObject());
        const { _id } = doc.toObject();
        _id && res.json({ msg: "Product Added successfully", _id });
    });
  } catch (error) {}
});

module.exports = router;
