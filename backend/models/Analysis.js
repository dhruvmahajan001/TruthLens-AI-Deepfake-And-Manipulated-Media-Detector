const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    inputType: String, // text or image
    content: String, // text or file name
    score: Number,
    risk: String,
    message: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Analysis", analysisSchema);
