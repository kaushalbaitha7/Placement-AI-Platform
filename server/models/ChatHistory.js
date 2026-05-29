const mongoose = require("mongoose");

/* ===============================
   MESSAGE SCHEMA
=============================== */

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "mentor"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

/* ===============================
   SESSION SCHEMA
=============================== */

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: "New Chat"
  },
  messages: {
    type: [messageSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("ChatSession", sessionSchema);