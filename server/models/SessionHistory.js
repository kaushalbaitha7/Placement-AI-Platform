const mongoose = require("mongoose");

const mistakeSchema = new mongoose.Schema({
  concept: String,
  reason: String
}, { _id: false });

const sessionHistorySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sessionType: {
    type: String,
    enum: ["Mentor", "Interview"],
    required: true
  },

  topic: {
    type: String,
    required: true
  },

  score: {
    type: Number,
    required: true
  },

  percentage: {
    type: Number,
    required: true
  },

  mistakes: [mistakeSchema],

  timeTaken: {
    type: Number   // in seconds
  }

}, { timestamps: true });

module.exports = mongoose.model("SessionHistory", sessionHistorySchema);