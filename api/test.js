require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser"); // npm install csv-parser
const { Test } = require("../api/models/diagnosis");

async function importTestsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const tests = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Convert fields accordingly
        tests.push({
          name: row.name.trim(),
          code: row.code.trim(),
          description: row.description || "",
          availableInMedicalCenter: row.availableInMedicalCenter === "true",
          price: Number(row.price) || 0,
        });
      })
      .on("end", () => resolve(tests))
      .on("error", reject);
  });
}

async function upsertTests(tests) {
  for (const test of tests) {
    // Check if a test with same code or name exists
    const existing = await Test.findOne({
      $or: [{ code: test.code }, { name: test.name }],
    });

    if (existing) {
      console.log(
        `Skipped duplicate: Code='${test.code}', Name='${test.name}'`
      );
      continue; // Skip insert
    }

    // Insert new test
    const newTest = new Test(test);
    await newTest.save();
    console.log(`Inserted test: Code='${test.code}', Name='${test.name}'`);
  }
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const tests = await importTestsFromCSV(
      "../api/medical_tests_with_descriptions.csv"
    );
    await upsertTests(tests);

    console.log("Import finished");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
