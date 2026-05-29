// server/routes/mentorRoutes.js

const express = require("express");
const router = express.Router();

const {
  handleMentorSession,
  handleMentorChat,
  handleStreamingChat,
  getUserChats   // 🔥 FIX: properly imported
} = require("../controllers/mentorController");

/*
====================================================
POST /api/mentor/session
Used after quiz completion
====================================================
*/
router.post("/session", handleMentorSession);

/*
====================================================
POST /api/mentor/ask
Normal AI chat (non-stream)
====================================================
*/
router.post("/ask", handleMentorChat);

/*
====================================================
POST /api/mentor/stream
Streaming GPT response
====================================================
*/
router.post("/stream", handleStreamingChat);

/*
====================================================
GET /api/mentor/history/:userId
Fetch user chat history
====================================================
*/
router.get("/history/:userId", getUserChats);

module.exports = router;