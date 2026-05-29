const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

    userId: mongoose.Schema.Types.ObjectId,

    topic: String,

    score: Number,

    percentage: Number

}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);