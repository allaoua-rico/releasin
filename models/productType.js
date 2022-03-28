const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    created_at: { type: Date, required: true, default: Date.now },

    attributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        required: true,
      },
    ],
  },

  { collection: "productTypes" }
);

module.exports =
  mongoose.models?.ProductType ||
  mongoose.model("ProductType", productTypeSchema);
