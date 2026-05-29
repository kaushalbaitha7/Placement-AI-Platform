const express = require("express");
const router = express.Router();

const Question = require("../models/Question");

/* ✅ GET QUESTIONS BY TOPIC */
router.get("/:topic", async (req, res) => {
    try {

        const { topic } = req.params;

        const questions = await Question.find({ topic });

        res.json(questions);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;