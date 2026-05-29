// server/services/openaiService.js

const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =================================================
   1️⃣ NORMAL CHAT RESPONSE
================================================= */

const generateAIResponse = async (messages) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.7
  });

  return {
    reply: completion.choices[0].message.content,
    tokens: completion.usage?.total_tokens || 0,
    model: "gpt-4o-mini"
  };
};


/* =================================================
   2️⃣ STREAMING GPT RESPONSE (CLEAN VERSION)
================================================= */

const streamAIResponse = async (messages, res) => {
  try {

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      stream: true
    });

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content;

      if (token) {
        res.write(token);   // Only new tokens (no duplication)
      }
    }

    res.end();

  } catch (error) {
    console.error("Streaming Service Error:", error);
    res.end();
  }
};


/* =================================================
   3️⃣ IMAGE ANALYSIS
================================================= */

const analyzeImage = async (filePath, userMessage) => {

  const absolutePath = path.join(__dirname, "..", filePath);
  const imageBuffer = fs.readFileSync(absolutePath);
  const base64Image = imageBuffer.toString("base64");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: userMessage },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ]
  });

  return {
    reply: completion.choices[0].message.content,
    tokens: completion.usage?.total_tokens || 0,
    model: "gpt-4o-mini"
  };
};


/* =================================================
   4️⃣ PDF ANALYSIS
================================================= */

const analyzePDF = async (filePath, userMessage) => {

  const absolutePath = path.join(__dirname, "..", filePath);
  const dataBuffer = fs.readFileSync(absolutePath);
  const pdfData = await pdfParse(dataBuffer);

  const prompt = `
User Question:
${userMessage}

PDF Content:
${pdfData.text}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return {
    reply: completion.choices[0].message.content,
    tokens: completion.usage?.total_tokens || 0,
    model: "gpt-4o-mini"
  };
};


/* =================================================
   5️⃣ CODE FILE ANALYSIS
================================================= */

const analyzeCode = async (filePath, userMessage) => {

  const absolutePath = path.join(__dirname, "..", filePath);
  const codeContent = fs.readFileSync(absolutePath, "utf-8");

  const prompt = `
User Question:
${userMessage}

Code:
${codeContent}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return {
    reply: completion.choices[0].message.content,
    tokens: completion.usage?.total_tokens || 0,
    model: "gpt-4o-mini"
  };
};


module.exports = {
  generateAIResponse,
  streamAIResponse,
  analyzeImage,
  analyzePDF,
  analyzeCode
};