const path = require("path");
const ChatHistory = require("../models/ChatHistory");
const { processSession } = require("../services/mentorEngine");
const OpenAI = require("openai");

const {
  generateAIResponse,
  analyzeImage,
  analyzePDF,
  analyzeCode
} = require("../services/openaiService");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ====================================================
   QUIZ PERFORMANCE SESSION
==================================================== */

const handleMentorSession = async (req, res) => {
  try {

    const {
      userId,
      topic,
      score,
      percentage,
      timeTaken,
      consecutiveWrong
    } = req.body;

    if (!userId || !topic) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const mentorDecision = await processSession({
      userId,
      topic,
      score,
      percentage,
      timeTaken,
      consecutiveWrong
    });

    let chat = await ChatHistory.findOne({ userId });

    if (!chat) {
      chat = new ChatHistory({ userId, messages: [] });
    }

    const summaryMessage = `
Session Analysis for ${topic}

Score: ${score}
Percentage: ${percentage}%

Feedback:
${mentorDecision.summary}
`;

    chat.messages.push({
      role: "mentor",
      content: summaryMessage,
      topic
    });

    await chat.save();

    res.json({
      message: "Mentor analysis complete",
      mentorDecision
    });

  } catch (error) {
    console.error("Mentor Session Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ====================================================
   NORMAL CHAT (NON-STREAM)
==================================================== */

const handleMentorChat = async (req, res) => {

  try {

    const { userId, message, filePath } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    let chat = await ChatHistory.findOne({ userId });

    if (!chat) {
      chat = new ChatHistory({ userId, messages: [] });
    }

    chat.messages.push({
      role: "user",
      content: message
    });

    let aiResult;
    let aiReply = "";

    if (filePath) {

      const ext = path.extname(filePath).toLowerCase();

      if ([".png", ".jpg", ".jpeg"].includes(ext)) {
        aiResult = await analyzeImage(filePath, message);
      }
      else if (ext === ".pdf") {
        aiResult = await analyzePDF(filePath, message);
      }
      else if ([".js", ".java", ".py", ".cpp", ".c"].includes(ext)) {
        aiResult = await analyzeCode(filePath, message);
      }
      else {
        aiReply = "Unsupported file type.";
      }

      if (aiResult) {
        aiReply = aiResult.reply;
      }

    } else {

      const memoryWindow = chat.messages.slice(-15);

      const formattedMessages = memoryWindow.map(msg => ({
        role: msg.role === "mentor" ? "assistant" : "user",
        content: msg.content
      }));

      aiResult = await generateAIResponse(formattedMessages);
      aiReply = aiResult.reply;
    }

    chat.messages.push({
      role: "mentor",
      content: aiReply,
      modelUsed: aiResult?.model || "gpt-4o-mini",
      tokensUsed: aiResult?.tokens || 0
    });

    await chat.save();

    res.json({
      reply: aiReply,
      conversation: chat.messages.slice(-20)
    });

  } catch (error) {
    console.error("Mentor Chat Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ====================================================
   STREAMING CHAT (SAFE + NO CRASH)
==================================================== */

const handleStreamingChat = async (req, res) => {

  try {

    const { userId, messages } = req.body;

    if (!userId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({
        message: "Messages and userId required"
      });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    let fullReply = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true
    });

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content;
      if (token) {
        fullReply += token;
        res.write(token);
      }
    }

    res.end();

    /* -------- SAVE AFTER STREAM -------- */

    try {

      let chat = await ChatHistory.findOne({ userId });

      if (!chat) {
        chat = new ChatHistory({ userId, messages: [] });
      }

      const lastUserMessage = messages[messages.length - 1];

      chat.messages.push({
        role: "user",
        content: lastUserMessage.content
      });

      chat.messages.push({
        role: "mentor",
        content: fullReply,
        modelUsed: "gpt-4o-mini"
      });

      await chat.save();

    } catch (dbError) {
      console.error("DB Save Error:", dbError);
    }

  } catch (error) {

    console.error("Streaming Controller Error:", error);

    if (!res.headersSent) {
      res.status(500).json({ message: "Streaming failed." });
    }
  }
};

/* ====================================================
   GET ALL USER CHAT SESSIONS
==================================================== */

const getUserChats = async (req, res) => {

  try {

    const { userId } = req.params;

    const chats = await ChatHistory.find({ userId })
      .sort({ updatedAt: -1 });

    res.json(chats);

  } catch (error) {
    console.error("History Fetch Error:", error);
    res.status(500).json({ message: "Error fetching chat history" });
  }
};

/* ====================================================
   EXPORTS
==================================================== */

module.exports = {
  handleMentorSession,
  handleMentorChat,
  handleStreamingChat,
  getUserChats
};