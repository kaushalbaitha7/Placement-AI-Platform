// server/services/strategyEngine.js

const determineDifficulty = (avgScore) => {
  if (avgScore < 40) return "Easy";
  if (avgScore < 70) return "Medium";
  return "Hard";
};

const determineConfidence = (avgScore, improvementRate) => {
  if (avgScore < 40) return "Low";
  if (improvementRate > 10) return "High";
  return "Medium";
};

const shouldGiveHint = (confidenceLevel, consecutiveWrong) => {
  if (confidenceLevel === "Low") return true;
  if (consecutiveWrong >= 2) return true;
  return false;
};

const shouldShiftTopic = (avgScore, attempts) => {
  if (attempts >= 3 && avgScore > 75) return true;
  return false;
};

const analyzeTrend = (previousScore, currentScore) => {
  if (!previousScore) return "Stable";

  const diff = currentScore - previousScore;

  if (diff > 5) return "Improving";
  if (diff < -5) return "Declining";
  return "Stable";
};

const buildStrategy = ({
  avgScore,
  previousScore,
  attempts,
  consecutiveWrong
}) => {

  const difficulty = determineDifficulty(avgScore);
  const improvementRate = previousScore
    ? avgScore - previousScore
    : 0;

  const confidenceLevel = determineConfidence(avgScore, improvementRate);
  const giveHint = shouldGiveHint(confidenceLevel, consecutiveWrong);
  const shiftTopic = shouldShiftTopic(avgScore, attempts);
  const trend = analyzeTrend(previousScore, avgScore);

  return {
    difficulty,
    confidenceLevel,
    giveHint,
    shiftTopic,
    trend
  };
};

module.exports = {
  buildStrategy
};