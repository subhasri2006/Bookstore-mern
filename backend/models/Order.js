const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: String,
  items: [
    {
      bookId: String,
      title: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: Number
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);