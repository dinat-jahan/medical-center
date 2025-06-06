const mongoose = require("mongoose");

// Role determination logic
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

// Schema definition
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
  sex: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  department: { type: String },
  program: {
    type: String,
    enum: ["graduate", "undergraduate", ""],
  },
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

// Static method
medicalUserSchema.statics.determineRole = determineRole;

medicalUserSchema.set("toObject", { virtuals: true });
medicalUserSchema.set("toJSON", { virtuals: true });

medicalUserSchema.virtual("writtenPrescriptions", {
  ref: "Prescription", // Look in the Prescription cabinet
  localField: "_id", // Use THIS user’s ID...
  foreignField: "doctor", // ...to match Prescription.doctor
});

medicalUserSchema.virtual("receivedPrescriptions", {
  ref: "Prescription", // which model to query
  localField: "_id", // this user’s _id…
  foreignField: "patient", // …matches Prescription.patient
});

// Model
const MedicalUser = mongoose.model("MedicalUser", medicalUserSchema);

module.exports = MedicalUser;
