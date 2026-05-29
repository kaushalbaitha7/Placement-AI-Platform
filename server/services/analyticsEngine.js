// server/services/analyticsEngine.js

const MentorProfile = require("../models/MentorProfile");
const SessionHistory = require("../models/SessionHistory");

/*
  Update mentor profile after each session
*/

const updateMentorProfile = async ({
  userId,
  topic,
  score,
  percentage,
  timeTaken
}) => {

  let profile = await MentorProfile.findOne({ userId });

  if (!profile) {
    profile = new MentorProfile({ userId });
  }

  const topicData = profile.topicProgress.get(topic) || {
    attempts: 0,
    avgScore: 0,
    improvementRate: 0,
    confidenceLevel: "Low"
  };

  const previousAvg = topicData.avgScore;

  const newAttempts = topicData.attempts + 1;

  const newAvgScore =
    ((topicData.avgScore * topicData.attempts) + percentage) / newAttempts;

  const improvementRate = newAvgScore - previousAvg;

  topicData.attempts = newAttempts;
  topicData.avgScore = Math.round(newAvgScore);
  topicData.improvementRate = Math.round(improvementRate);

  profile.topicProgress.set(topic, topicData);

  /* Update learning pattern */

  if (profile.learningPattern.avgResponseTime === 0) {
    profile.learningPattern.avgResponseTime = timeTaken;
  } else {
    profile.learningPattern.avgResponseTime =
      Math.round(
        (profile.learningPattern.avgResponseTime + timeTaken) / 2
      );
  }

  if (improvementRate > 5) {
    profile.learningPattern.accuracyTrend = "Improving";
  } else if (improvementRate < -5) {
    profile.learningPattern.accuracyTrend = "Declining";
  } else {
    profile.learningPattern.accuracyTrend = "Stable";
  }

  await profile.save();

  /* Save session history */

  await SessionHistory.create({
    userId,
    sessionType: "Mentor",
    topic,
    score,
    percentage,
    timeTaken
  });

  return profile;
};

module.exports = {
  updateMentorProfile
};