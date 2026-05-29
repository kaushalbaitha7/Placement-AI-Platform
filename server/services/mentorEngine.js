// server/services/mentorEngine.js

const MentorProfile = require("../models/MentorProfile");
const { updateMentorProfile } = require("./analyticsEngine");
const { buildStrategy } = require("./strategyEngine");

/*
  MAIN ENTRY FUNCTION
  Called after every quiz/session
*/

const processSession = async ({
  userId,
  topic,
  score,
  percentage,
  timeTaken,
  consecutiveWrong = 0
}) => {

  /* 1️⃣ Update analytics first */
  const updatedProfile = await updateMentorProfile({
    userId,
    topic,
    score,
    percentage,
    timeTaken
  });

  /* 2️⃣ Extract topic data */
  const topicData = updatedProfile.topicProgress.get(topic);

  const avgScore = topicData.avgScore;
  const attempts = topicData.attempts;
  const previousScore =
    attempts > 1 ? (avgScore - topicData.improvementRate) : 0;

  /* 3️⃣ Build strategy */
  const strategy = buildStrategy({
    avgScore,
    previousScore,
    attempts,
    consecutiveWrong
  });

  /* 4️⃣ Final Mentor Decision Object */

  const mentorDecision = {
    nextDifficulty: strategy.difficulty,
    confidenceLevel: strategy.confidenceLevel,
    giveHint: strategy.giveHint,
    shiftTopic: strategy.shiftTopic,
    trend: strategy.trend,
    recommendedAction: generateRecommendation(strategy, topic)
  };

  return mentorDecision;
};


/*
  Generate human-readable recommendation
*/

const generateRecommendation = (strategy, topic) => {

  if (strategy.shiftTopic) {
    return `You have mastered ${topic}. Let's move to a more advanced topic.`;
  }

  if (strategy.confidenceLevel === "Low") {
    return `Focus on fundamentals of ${topic}. Practice easy-level problems.`;
  }

  if (strategy.trend === "Improving") {
    return `Good progress in ${topic}. Try medium difficulty next.`;
  }

  if (strategy.trend === "Declining") {
    return `Performance dropped in ${topic}. Review key concepts before proceeding.`;
  }

  return `Continue practicing ${topic} at ${strategy.difficulty} level.`;
};


module.exports = {
  processSession
};