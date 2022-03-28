const mongoose = require("mongoose");

const assignedAttribute = new mongoose.Schema(
  {
    attributeValue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
    },
  },

  { collection: "assignedAttributes" }
);

module.exports =
  mongoose.models?.AssignedAttribute || mongoose.model("AssignedAttribute", assignedAttribute);
