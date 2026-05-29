const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");   // ✅ NEW

/* 🌿 SIGNUP */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Signup successful ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 🌿 LOGIN */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      "secretkey",   // Later move to .env 😌
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful ✅", token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ------------------------------------------------ */
/* 🌿 FORGOT PASSWORD */
/* ------------------------------------------------ */

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    /* ✅ Generate RAW Token */
    const resetToken = crypto.randomBytes(32).toString("hex");

    /* ✅ HASH Token (CRITICAL SECURITY STEP) */
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    /* ✅ Send RAW token to user */
    res.json({
      message: "Password reset token generated ✅",
      resetToken
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ------------------------------------------------ */
/* 🌿 RESET PASSWORD */
/* ------------------------------------------------ */

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Invalid request" });

    /* ✅ HASH Incoming Token */
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};