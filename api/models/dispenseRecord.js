const mongoose = require("mongoose");

const DispensedItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, "Quantity must be non-negative"],
  },
  status: {
    type: String,
    enum: ["pending", "dispensed"],
    default: "pending",
  },
});

const DispenseRecordSchema = new mongoose.Schema(
  {
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalUser",
      required: true,
    },
    pharmacyStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalUser",
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
    medicines: [DispensedItemSchema],
    overallStatus: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DispenseRecord", DispenseRecordSchema);
