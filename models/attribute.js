const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    name: String,

    type: [
      {
        type: String,
        required: true,
        enum: ["text", "boolean", "date"],
      },
    ],
    attributeValue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
    },
  },

  { collection: "attributes" }
);

module.exports =
  mongoose.models?.Attribute || mongoose.model("Attribute", attributeSchema);
