const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,

    created_at    : { type: Date, required: true, default: Date.now },

    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required:true
    },
    assignedAttributes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignedAttribute",
      required:true
    }],
  },

  { collection: "products" }
);

module.exports =
  mongoose.models?.Product || mongoose.model("Product", productSchema);
