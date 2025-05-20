const mongoose = require("mongoose");

const telemedicineDutySchema = new mongoose.Schema({
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
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalUser", // or "Doctor" depending on your model
    required: true,
  },
});

telemedicineDutySchema.index({ day: 1, doctor: 1 }, { unique: true });

module.exports = mongoose.model("TelemedicineDuty", telemedicineDutySchema);
