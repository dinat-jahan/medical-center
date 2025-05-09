const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalUser",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalUser",
    required: true,
  },
  date: { type: Date, default: Date.now },
  diagnosis: { type: String },
  age: { type: Number },
  followUpDate: { type: Date },
  advice: { type: String },

  medicines: [
    {
      drugName: String,
      dose: String,
      frequency: String,
      startDate: Date,
      duration: String,
      totalQuantity: Number,
      comments: String,
      dispensedFrom: {
        type: String,
        enum: ["internal", "external"],
        required: true,
      },
    },
  ],
});

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
module.exports = Prescription;
