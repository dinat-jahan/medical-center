const mongoose = require("mongoose");
const { MedicalUser } = require("./medicalUser"); // Reference to the new MedicalUser model

const DutyRosterDoctorSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalUser", // Reference to the MedicalUser model
    required: true,
  },
  day: {
    type: String,
    enum: [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    required: true,
  },
  shift: {
    type: String,
    enum: ["Morning", "Evening", "Full day"],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  // telemedicineDay: {
  //   type: Boolean,
  //   default: false, // Optional field for telemedicine availability
  // },
});

const DutyRosterDoctor = mongoose.model(
  "DutyRosterDoctor",
  DutyRosterDoctorSchema
);

module.exports = DutyRosterDoctor;
