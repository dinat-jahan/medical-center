// === controllers/authPasswordController.js ===
require("dotenv").config();
const bcrypt = require("bcrypt");
const MedicalUser = require("../models/medicalUser");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");
const OtpModel = require("../models/otp");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.fetchUserForReset = async (req, res) => {
  try {
    const uniqueId = req.params.uniqueId.toLowerCase();
    const member = await MedicalUser.findOne({ uniqueId });
    console.log(member);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return minimal info for password reset flow
    res.json({
      success: true,
      member,
    });
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 1. Send OTP for password reset
exports.sendResetOtp = asyncHandler(async (req, res) => {
  await check("uniqueId", "Unique ID is required").notEmpty().run(req);
  await check("email", "Valid email is required").isEmail().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { uniqueId, email } = req.body;
  const user = await MedicalUser.findOne({ uniqueId: uniqueId.toLowerCase() });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!user.emails.includes(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Email not associated with user" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await OtpModel.findOneAndUpdate(
    { uniqueId },
    { uniqueId, otp, createdAt: Date.now() },
    { upsert: true, new: true }
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your password reset code is ${otp}`,
  });

  res.json({ success: true, message: `OTP sent to ${email}` });
});

// 2. Verify reset OTP
exports.verifyResetOtp = asyncHandler(async (req, res) => {
  await check("uniqueId", "Unique ID is required").notEmpty().run(req);
  await check("otp", "OTP is required").notEmpty().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { uniqueId, otp } = req.body;
  const record = await OtpModel.findOne({ uniqueId });
  if (!record) {
    return res
      .status(410)
      .json({ success: false, message: "OTP expired or not found" });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }

  await OtpModel.deleteOne({ uniqueId });
  res.json({ success: true, message: "OTP verified successfully" });
});

// 3. Reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  await check("uniqueId", "Unique ID is required").notEmpty().run(req);
  await check("password", "New password must be at least 6 characters")
    .isLength({ min: 6 })
    .run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { uniqueId, password } = req.body;
  const user = await MedicalUser.findOne({ uniqueId: uniqueId.toLowerCase() });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});
