const mongoose = require("mongoose");

const universityDBAdminSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "university-admin",
    },
  },
  { timestamps: true }
);

const medicalDBAdminSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "medical-admin",
    },
  },
  { timestamps: true }
);

const UniversityDBAdmin = mongoose.model(
  "UniversityDBAdmin",
  universityDBAdminSchema
);
const MedicalDBAdmin = mongoose.model("MedicalDBAdmin", medicalDBAdminSchema);
module.exports = { UniversityDBAdmin, MedicalDBAdmin };
