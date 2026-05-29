// server/routes/uploadRoutes.js

const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

/*
========================================
MULTER STORAGE CONFIGURATION
========================================
*/

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }

});

/*
========================================
FILE FILTER (Optional Security)
========================================
*/

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024   // 5MB limit
  },
  fileFilter
});

/*
========================================
POST /api/upload/file
========================================
*/

router.post("/file", upload.single("file"), (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    res.json({
      message: "File uploaded successfully",
      filePath: req.file.path,
      fileName: req.file.filename,
      fileType: req.file.mimetype
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      message: "Upload failed"
    });
  }

});

module.exports = router;