const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    },

    type: {
      type: String,
      enum: ["view", "wishlist", "purchase", "search"],
      required: true
    },

    searchQuery: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interaction", interactionSchema);