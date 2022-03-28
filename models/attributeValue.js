const mongoose = require("mongoose");

const attributeValueSchema = new mongoose.Schema(
  {
    name: [{ type: String, required: true }],
    boolean: Boolean,
    date: Date,
  },

  { collection: "attributeValues" }
);

module.exports =
  mongoose.models?.AttributeValue || mongoose.model("AttributeValue", attributeValueSchema);
