const Result = require("../models/Result");

exports.saveResult = async (req, res) => {
    try {

        const { userId, topic, score, percentage } = req.body;

        const result = await Result.create({
            userId,
            topic,
            score,
            percentage
        });

        res.json({ message: "Result stored successfully ✅" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};