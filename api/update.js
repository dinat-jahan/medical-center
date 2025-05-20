// scripts/set-departments.js
require("dotenv").config();
const mongoose = require("mongoose");
const MedicalUser = require("../api/models/medicalUser");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const updates = [
    {
      ids: ["stm014", "stm004", "stm006", "stm007", "stm008"],
      department: "nurse and brother",
    },
    { ids: ["stm005", "stm009", "stm012", "stm010"], department: "attendant" },
    { ids: ["stm003", "stm013"], department: "pathology" },
  ];

  for (const group of updates) {
    const res = await MedicalUser.updateMany(
      { uniqueId: { $in: group.ids } },
      { $set: { department: group.department } }
    );
    console.log(
      `Updated ${res.modifiedCount} users to department "${group.department}"`
    );
  }

  await mongoose.disconnect();
  console.log("Department update complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
