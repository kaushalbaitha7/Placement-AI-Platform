const mongoose = require("mongoose");
const XLSX = require("xlsx");
const Question = require("../models/Question");
require("dotenv").config();

/* 🌿 CONNECT DATABASE */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected 🌿"))
    .catch(err => console.log(err));

/* 🌿 READ EXCEL */
const workbook = XLSX.readFile("questions.xlsx");  
const sheetName = workbook.SheetNames[0];
const sheetData = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetName]
);

/* 🌿 IMPORT ENGINE */
const importData = async () => {

    try {

        await Question.deleteMany(); // optional reset
        console.log("Old Questions Cleared ✅");

        await Question.insertMany(sheetData);

        console.log("Questions Imported Successfully 🚀");

        process.exit();

    } catch (error) {

        console.log("Import Error ❌", error);
        process.exit(1);
    }
};

importData();