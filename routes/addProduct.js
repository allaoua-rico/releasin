const express = require("express");
const multer = require("multer");
const Product = require("../models/product");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const DatauriParser = require("datauri/parser");
const ProductCategory = require("../models/category");

//this is a cutumised cloudinary in folder cloudinary
const cloudinary = require("../backLib/cloudinary.js");

//multer memory config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", verifyJWT, upload.array("images"), async (req, res) => {
  try {
    //on the guide he imported datauti, he should have imported datauriParser, read the doc
    const dUri = new DatauriParser();

    // transform the buffer to a string
    const dataUri = (file) =>
      dUri.format(path.extname(file.originalname).toString(), file.buffer);

    const imgUrlArray = [];

    for (var i = 0; i < req.files.length; i++) {
      imgUrlArray.push(dataUri(req.files[i]).content);
    }

    const uploader = async (path) => await cloudinary.uploads(path, `e-shop`);
    let newArray = [];
    for (const path of imgUrlArray) {
      const newPath = await uploader(path);
      newArray.push(newPath.url);
    }
    // console.log(req.body);

    //search for category or add the one provided
    let catId;
    let instance;
    //check if category is defined
    let str = req.body.category;
    console.log(str.replace(/\s/g, "").length);
    if (str.replace(/\s/g, "").length) {
      instance = await ProductCategory.findOne(
        { name: req.body.category },
        { _id: 1 }
      )
        .lean()
        .catch((err) => console.log(err));
      if (instance !== null) {
        catId = instance._id;
      }
      if (instance === null) {
        const newCategory = new ProductCategory({
          name: req.body.category,
        });
        instance = await newCategory.save();
        catId = instance._id;
      }
    } else {
      catId = undefined;
    }
    // console.log(catId);
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      imagesArray: newArray,
      desc: req.body.desc,
      category_id: catId,
      brand: req.body.brand,
    });
    product
      .save()
      .then((doc) => {
        const { _id } = doc.toObject();
        _id && res.json({ msg: "Product Added successfully", _id });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  } catch (error) {
    console.log(error);
  }
});
function verifyJWT(req, res, next) {
  // console.log(req.headers['x-access-token'])

  const token = req.headers["x-access-token"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: "Failed To Authenticate",
        });
      req.user = {};
      req.user.id = decoded.id;
      req.user.username = decoded.username;
      next();
    });
  } else {
    res.json({ message: "Incorrect Token Given", isLoggedIn: false });
  }
}
module.exports = router;
