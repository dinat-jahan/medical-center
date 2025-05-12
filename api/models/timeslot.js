const mongoose = require("mongoose");

const TimeSlotSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalUser",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true, // e.g., "08:30 AM"
  },
  status: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available",
  },
  bookingStatus: {
    type: String,
    enum: ["booked", ""],
    default: "",
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalUser",
    default: null,
  },
  queueNumber: {
    type: Number,
  },
});

const TimeSlot = mongoose.model("TimeSlot", TimeSlotSchema);
module.exports = TimeSlot;
