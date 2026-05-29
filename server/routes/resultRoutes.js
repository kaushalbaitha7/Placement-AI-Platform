const express = require("express");
const router = express.Router();

const Result = require("../models/Result");

/* ✅ SAVE QUIZ RESULT */
router.post("/save", async (req, res) => {
    try {

        const { userId, topic, score, percentage } = req.body;

        const result = await Result.create({
            userId,
            topic,
            score,
            percentage
        });

        res.json({ message: "Result stored ✅" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;