const mongoose = require("mongoose");

const DiagnosisSchema = new mongoose.Schema(
  {
    code: { type: String },
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Diagnosis = mongoose.model("Diagnosis", DiagnosisSchema);
module.exports = Diagnosis;
