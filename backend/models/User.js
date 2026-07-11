const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
   phone: {
    type: String,
    default: ""
  },
  cart: [cartSchema],

  // ✅ FIXED — INSIDE schema
 wishlist: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "Book",
  default: []   // ✅ THIS FIXES FOREVER
}
});

module.exports = mongoose.model("User", userSchema);