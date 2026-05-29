const express = require("express");
const router = express.Router();

const {
  startInterview,
  respondInterview
} = require("../controllers/interviewController");

router.post("/start", startInterview);
router.post("/respond", respondInterview);

module.exports = router;