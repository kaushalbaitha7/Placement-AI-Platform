const mongoose = require("mongoose");

const topicMasterSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },

  topic: {
    type: String,
    required: true,
    unique: true
  },

  subtopics: [
    {
      type: String
    }
  ],

  difficultyLevels: [
    {
      type: String,
      enum: ["Easy", "Medium", "Hard"]
    }
  ],

  totalQuestions: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("TopicMaster", topicMasterSchema);