// scripts/sync-university-to-medical.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UniversityMember = require("../api/models/universityMember");
const MedicalUser = require("../api/models/medicalUser");

const MALE_PHOTO =
  "bb9eb535d096f173f9338f7a12e266961108a5ee96a5eb414624cde5a04affce";
const FEMALE_PHOTO =
  "9ee1a43f0e7c040655c1f29228b2c78624b9f903c1d9d9f12064ffa3b8f94e08";

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  // 1) UniversityMember
  const umMale = await UniversityMember.updateMany(
    { sex: "male" },
    { $set: { photo: MALE_PHOTO } }
  );
  const umFemale = await UniversityMember.updateMany(
    { sex: "female" },
    { $set: { photo: FEMALE_PHOTO } }
  );

  console.log(
    `UniversityMember: ${umMale.modifiedCount} male docs, ${umFemale.modifiedCount} female docs updated.`
  );

  // 2) MedicalUser
  const muMale = await MedicalUser.updateMany(
    { sex: "male" },
    { $set: { photo: MALE_PHOTO } }
  );
  const muFemale = await MedicalUser.updateMany(
    { sex: "female" },
    { $set: { photo: FEMALE_PHOTO } }
  );

  console.log(
    `MedicalUser: ${muMale.modifiedCount} male docs, ${muFemale.modifiedCount} female docs updated.`
  );

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
