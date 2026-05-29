const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  code: String,
  explanation: String,
  complexity: String
}, { _id: false });

const conceptKnowledgeSchema = new mongoose.Schema({

  domain: {
    type: String,
    required: true
  },

  topic: {
    type: String,
    required: true
  },

  subtopic: {
    type: String
  },

  languageSupport: {
    Java: languageSchema,
    Python: languageSchema,
    Cpp: languageSchema,
    C: languageSchema,
    JavaScript: languageSchema
  },

  commonMistakes: [
    {
      type: String
    }
  ],

  interviewInsights: [
    {
      type: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("ConceptKnowledge", conceptKnowledgeSchema);