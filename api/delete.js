// scripts/delete-staff.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UniversityMember = require("../api/models/universityMember");
const MedicalUser = require("../api/models/medicalUser");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  // 1) Fetch all uniqueIds already in MedicalUser
  const existingIds = await MedicalUser.find().distinct("uniqueId");

  // 2) From UniversityMember pick only staff not yet in MedicalUser
  const toInsert = await UniversityMember.find({
    userType: "staff",
    uniqueId: { $nin: existingIds },
  });

  // 3) Prepare one shared hashed temp password
  const tempPassword = "ChangeMe123!";
  const saltRounds = 10;
  const hashed = await bcrypt.hash(tempPassword, saltRounds);

  // 4) Insert missing staff
  for (let u of toInsert) {
    const role = MedicalUser.determineRole(u.userType, u.designation, u.office);

    await MedicalUser.create({
      uniqueId: u.uniqueId,
      name: u.name,
      userType: u.userType,
      sex: u.sex,
      department: u.department,
      program: u.program,
      office: u.office,
      designation: u.designation,
      designation_2: u.designation_2,
      hall: u.hall,
      session: u.session,
      bloodGroup: u.bloodGroup,
      dob: u.dob,
      emails: u.emails,
      phone: u.phone,
      photo: u.photo,
      role: role,
      password: hashed,
    });
    console.log(`🔹 Created MedicalUser for ${u.uniqueId}`);
  }

  // 5) OPTIONAL: for existing MedicalUsers missing a password, set one now
  const needsPwd = await MedicalUser.find({
    uniqueId: { $in: existingIds },
    $or: [{ password: { $exists: false } }, { password: null }],
  });
  for (let mu of needsPwd) {
    mu.password = hashed;
    await mu.save();
    console.log(`🔸 Set temp password for existing ${mu.uniqueId}`);
  }

  console.log("✅ Sync complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
