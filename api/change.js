const mongoose = require("mongoose");
const MedicalUser = require("../api/models/medicalUser"); // adjust path
const UniversityMember = require("../api/models/universityMember"); // adjust path

async function syncSexField() {
  try {
    await mongoose.connect(
      "mongodb+srv://dinat_jahan:dinat_jahan01@cluster0.ugsd1.mongodb.net/"
    );

    const medicalUsers = await MedicalUser.find();

    for (const user of medicalUsers) {
      // Assuming email is the common field
      const uniMember = await UniversityMember.findOne({
        uniqueId: user.uniqueId,
      });

      if (uniMember && uniMember.sex) {
        user.sex = uniMember.sex;
        await user.save();
        console.log(`Updated ${user.uniqueId} with sex: ${user.sex}`);
      } else {
        console.log(`No university member found for ${user.email}`);
      }
    }

    console.log("Update complete.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error syncing sex field:", error);
  }
}

syncSexField();
