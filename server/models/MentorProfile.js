const mongoose = require("mongoose");

const topicProgressSchema = new mongoose.Schema({
  attempts: {
    type: Number,
    default: 0
  },
  avgScore: {
    type: Number,
    default: 0
  },
  improvementRate: {
    type: Number,
    default: 0
  },
  confidenceLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  }
}, { _id: false });

const mentorProfileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  topicProgress: {
    type: Map,
    of: topicProgressSchema
  },

  weakConcepts: [
    {
      type: String
    }
  ],

  strongConcepts: [
    {
      type: String
    }
  ],

  learningPattern: {
    avgResponseTime: {
      type: Number,
      default: 0
    },
    accuracyTrend: {
      type: String,
      default: "Stable"
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);