require("dotenv").config({ override: true });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ROUTES */
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* API ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/uploads", express.static("uploads"));

/* DATABASE */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.listen(5000, () =>
  console.log("Server running on port 5000 🚀")
);