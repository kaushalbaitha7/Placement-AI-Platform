require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* =========================
   Middlewares
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

/* =========================
   Routes
========================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));

app.use("/uploads", express.static("uploads"));

/* =========================
   Database
========================= */

mongoose
.connect(process.env.MONGO_URI)
.then(() => {

    console.log("✅ MongoDB Connected");

    app.listen(5000, () => {

        console.log("🚀 Server Running on Port 5000");

    });

})
.catch((err) => {

    console.log(err);

});