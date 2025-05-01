const mongoose = require("mongoose");

function determineRole(userType, designation, office) {
  const lowerDesignation = (designation || "").toLowerCase();
  const lowerOffice = (office || "").toLowerCase();

  if (userType === "student" || userType === "teacher") {
    return "patient";
  }
  if (
    lowerDesignation.includes("doctor") ||
    lowerDesignation.includes("medical officer")
  ) {
    return "doctor";
  }
  if (lowerOffice.includes("medical center")) {
    return "medical-staff";
  }
  return "patient";
}

const medicalUserSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  userType: {
    type: String,
    enum: ["student", "teacher", "staff"],
    required: true,
  },
  department: { type: String },
  office: { type: String },
  designation: { type: String },
  designation_2: { type: String },
  hall: { type: String },
  session: { type: String },
  bloodGroup: { type: String },
  dob: { type: Date, required: true },
  emails: { type: [String], required: true },
  phone: { type: String, required: true },
  photo: { type: String },
  password: { type: String },
  role: {
    type: String,
    enum: ["patient", "doctor", "medical-staff", "admin"],
    required: true,
  },
  googleId: { type: String, unique: true, sparse: true },
});

medicalUserSchema.statics.determineRole = determineRole;

const MedicalUser = mongoose.model("MedicalUser", medicalUserSchema);

module.exports = MedicalUser;
