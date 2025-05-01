const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const OtpModel = mongoose.model("OtpModel", otpSchema);
module.exports = OtpModel;
