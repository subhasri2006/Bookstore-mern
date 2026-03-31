const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    stock: { type: Number, default: 0 },
    image: { type: String }, // can store image URL or filename
    pdfFile: { type: String }, // store PDF path or URL
    isbn: { type: String } // remove unique: true
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);