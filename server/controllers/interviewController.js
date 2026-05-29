const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =================================================
   START INTERVIEW (FIRST QUESTION)
================================================= */

const startInterview = async (req, res) => {

  try {

    const { type } = req.body;

    let systemPrompt = "";

    /* -------- BASIC ROUND -------- */

    if (type === "basic") {
      systemPrompt = `
You are a basic aptitude interviewer.

Ask one simple question related to:
- basic programming
- computer fundamentals
- logical reasoning

Keep question short.
Do NOT give answer.
`;
    }

    /* -------- CODING ROUND -------- */

    if (type === "coding") {
      systemPrompt = `
You are a coding interviewer.

Ask one coding problem suitable for freshers.

Example topics:
- arrays
- strings
- loops
- basic DSA

Ask only the question.
`;
    }

    /* -------- HR ROUND -------- */

    if (type === "hr") {
      systemPrompt = `
You are a friendly HR interviewer.

Ask a behavioural interview question.

Examples:
- Tell me about yourself
- Strengths and weaknesses
- Why should we hire you
`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Start the interview." }
      ]
    });

    const question = completion.choices[0].message.content;

    res.json({
      success: true,
      question
    });

  } catch (error) {

    console.error("Interview Start Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to start interview"
    });
  }
};



/* =================================================
   ANSWER RESPONSE (FOLLOW UP QUESTION)
================================================= */

const respondInterview = async (req, res) => {

  try {

    const { answer, type } = req.body;

    let systemPrompt = "";

    if (type === "basic") {
      systemPrompt = "You are a basic aptitude interviewer.";
    }

    if (type === "coding") {
      systemPrompt = "You are a coding interviewer.";
    }

    if (type === "hr") {
      systemPrompt = "You are a HR interviewer.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `
Candidate answered:

${answer}

Give short feedback (1 sentence) and ask the next interview question.
`
        }
      ]
    });

    const response = completion.choices[0].message.content;

    res.json({
      success: true,
      nextQuestion: response
    });

  } catch (error) {

    console.error("Interview Response Error:", error);

    res.status(500).json({
      success: false,
      message: "Interview processing failed"
    });
  }
};



module.exports = {
  startInterview,
  respondInterview
};