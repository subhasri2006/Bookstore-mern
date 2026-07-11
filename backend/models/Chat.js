const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  text: String
});

const chatSchema = new mongoose.Schema({
  email: String,

  messages: [messageSchema]

}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);