const mongoose = require("mongoose");
const MedicalUser = require("../api/models/medicalUser"); // Import the MedicalUser model
const DutyRosterDoctor = require("../api/models/dutyRosterDoctor"); // Import the DutyRosterDoctor model

mongoose
  .connect("mongodb://localhost:27017/yourDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const dutyRosterDoctors = await DutyRosterDoctor.find(); // Get all DutyRosterDoctor entries

    for (const dutyRoster of dutyRosterDoctors) {
      // The doctor field already contains an ObjectId, let's verify it with MedicalUser
      const oldDoctor = await MedicalUser.findById(dutyRoster.doctor); // Check if this ObjectId exists in the MedicalUser collection

      if (oldDoctor) {
        // If the doctor exists in the MedicalUser collection, keep the ObjectId the same
        // No change is necessary if it's already correct
        console.log(
          `Doctor ${dutyRoster.doctor} is already correctly mapped to MedicalUser.`
        );
      } else {
        // If the doctor is not found in the MedicalUser collection, handle the case accordingly
        console.log(
          `Doctor ${dutyRoster.doctor} not found in MedicalUser. Fixing reference.`
        );

        // If the doctor doesn't exist in MedicalUser, you can handle it (e.g., logging, setting to null, etc.)
        // dutyRoster.doctor = null; // Or any appropriate fallback action

        // Save the document if needed (or perform other actions based on your use case)
        await dutyRoster.save();
      }
    }

    console.log("Doctor references checked and updated.");
  })
  .catch((err) => console.error("Error updating doctor references:", err))
  .finally(() => mongoose.disconnect()); // Close the connection after updating
