const express = require("express");
const router = express.Router();

/* 🌿 IMPORT ALL FUNCTIONS */
const {
  signup,
  login
} = require("../controllers/authController");

/* 🌿 ROUTES */
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;