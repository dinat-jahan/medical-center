// === controllers/authIdController.js ===
require("dotenv").config();
const bcrypt = require("bcrypt");
const UniversityMember = require("../models/universityMember");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");
const OtpModel = require("../models/otp");
const MedicalUser = require("../models/medicalUser");
const { UniversityDBAdmin, MedicalDBAdmin } = require("../models/admin");

// Utility: wrap async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

//fetch member by unique id
exports.fetchMember = asyncHandler(async (req, res, next) => {
  // Validate input
  if (!req.params.uniqueId) {
    return res
      .status(400)
      .json({ success: false, message: "Unique ID is required" });
  }

  const uniqueId = req.params.uniqueId.toLowerCase();
  const existing = await MedicalUser.findOne({ uniqueId });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "User already exists" });
  }

  const member = await UniversityMember.findOne({ uniqueId });
  if (!member) {
    return res.status(404).json({ success: false, message: "No member found" });
  }

  res.json({ success: true, member });
});

//send otp to email
exports.sendOtp = asyncHandler(async (req, res, next) => {
  await check("uniqueId", "Unique ID is required").notEmpty().run(req);
  await check("emailForOtp", "Valid email is required").isEmail().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { uniqueId, emailForOtp } = req.body;
  const member = await UniversityMember.findOne({
    uniqueId: uniqueId.toLowerCase(),
  });
  if (!member) {
    return res
      .status(404)
      .json({ success: false, message: "Member not found" });
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
    to: emailForOtp,
    subject: "Your OTP for MBSTU Medical Center registration",
    text: `Your OTP code is ${otp}`,
  });

  res.json({ success: true, message: `OTP sent to ${emailForOtp}` });
});

//verify otp
exports.verifyOtp = asyncHandler(async (req, res, next) => {
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

//save password in db
exports.saveUserPassword = asyncHandler(async (req, res, next) => {
  await check("uniqueId", "Unique ID is required").notEmpty().run(req);
  await check("password", "Password is required").isLength({ min: 6 }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { uniqueId, password } = req.body;
  const user = await UniversityMember.findOne({ uniqueId });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "University member not found" });
  }

  const role = MedicalUser.determineRole(
    user.userType,
    user.designation,
    user.office
  );
  const hashed = await bcrypt.hash(password, 10);

  const newUser = new MedicalUser({
    ...user.toObject(),
    password: hashed,
    role,
  });
  await newUser.save();

  req.session.user = {
    id: user._id.toString(),
    uniqueId: user.uniqueId,
    name: user.name,
    role,
  };
  res.json({ success: true, role });
});

//log in operation
exports.login = asyncHandler(async (req, res, next) => {
  await check("uniqueId", "Unique ID is required").notEmpty().run(req);
  await check("password", "Password is required").notEmpty().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { uniqueId, password } = req.body;
  const lower = uniqueId.toLowerCase();
  const user =
    (await MedicalUser.findOne({ uniqueId: lower })) ||
    (await UniversityDBAdmin.findOne({ uniqueId: lower })) ||
    (await MedicalDBAdmin.findOne({ uniqueId: lower }));

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!user.password) {
    return res
      .status(403)
      .json({ success: false, message: "Set password first" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });
  }

  req.session.user = {
    id: user._id.toString(),
    uniqueId: user.uniqueId,
    name: user.name,
    role: user.role,
  };
  res.json({ success: true, user: req.session.user });
});
