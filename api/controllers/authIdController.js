require("dotenv").config();
const bcrypt = require("bcrypt");
const UniversityMember = require("../models/universityMember");
const nodemailer = require("nodemailer");
const OtpModel = require("../models/otp");
const MedicalUser = require("../models/medicalUser");
const { UniversityDBAdmin, MedicalDBAdmin } = require("../models/admin");

//fetch member by unique id
exports.fetchMember = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const user = await MedicalUser.findOne({ uniqueId });
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }
    const member = await UniversityMember.findOne({ uniqueId: uniqueId });

    if (!member) {
      return res.json({ success: false, message: "No member found" });
    }
    res.json({
      success: true,
      member: {
        name: member.name,
        department: member.department,
        designation: member.designation,
        emails: member.emails,
        phone: member.phone,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//send otp to gmail
exports.sendOtp = async (req, res) => {
  const { uniqueId, emailForOtp } = req.body;
  console.log("emailforotp", emailForOtp);
  try {
    const member = await UniversityMember.findOne({ uniqueId });
    if (!member) {
      return res.json({ success: false, message: "Member not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
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
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Server error while sending OTP" });
  }
};

//verify otp
exports.verifyOtp = async (req, res) => {
  const { uniqueId, otp } = req.body;
  console.log("otp", otp);

  try {
    const foundOtp = await OtpModel.findOne({ uniqueId });
    if (!foundOtp) {
      return res.json({ success: false, message: "OTP expired or not found." });
    }

    if (foundOtp.otp === otp) {
      // Delete OTP from DB after use
      await OtpModel.deleteOne({ uniqueId });
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server error verifying OTP" });
  }
};

//save password in db
exports.saveUserPassword = async (req, res) => {
  const { uniqueId, password } = req.body;
  console.log(uniqueId);
  console.log(password);
  try {
    const user = await UniversityMember.findOne({ uniqueId });

    const role = MedicalUser.determineRole(
      user.userType,
      user.designation,
      user.office
    );

    console.log(user);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMedicalUser = new MedicalUser({
      uniqueId: user.uniqueId,
      name: user.name,
      userType: user.userType,
      department: user.department,
      office: user.office,
      designation: user.designation,
      designation_2: user.designation_2,
      hall: user.hall,
      session: user.session,
      bloodGroup: user.bloodGroup,
      dob: user.dob,
      emails: user.emails,
      phone: user.phone,
      photo: user.photo,
      password: hashedPassword, // after bcrypt hash
      role: role,
    });
    await newMedicalUser.save();
    req.session.user = {
      id: user._id.toString(),
      uniqueId: user.uniqueId,
      name: user.name,

      role: role,
    };
    res.json({ success: true, role: role });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Server error while saving password" });
  }
};

//log in operation
exports.login = async (req, res) => {
  const { uniqueId, password } = req.body;
  // const lowerUniqueId = uniqueId.toLowerCase();

  try {
    const user =
      (await MedicalUser.findOne({ uniqueId })) ||
      (await UniversityDBAdmin.findOne({ uniqueId })) ||
      (await MedicalDBAdmin.findOne({ uniqueId }));

    if (!user) {
      return res.status(401).send("User not found");
    }
    if (!user.password) {
      return res.redirect(`/set-password?uniqueId=${user.uniqueId}`);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid password");
    }

    // Set session
    req.session.user = {
      id: user._id.toString(),
      uniqueId: user.uniqueId,
      name: user.name,
      role: user.role,
    };
    return res.json({
      id: user._id,
      uniqueId: user.uniqueId,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

//set password
exports.setPassword = async (req, res) => {
  const { uniqueId, password } = req.body;
  try {
    const user = await MedicalUser.findOne({ uniqueId });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = await bycrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
  } catch (e) {
    console.log(e);
  }
};

//get set-password page
// router.get("/set-password", (req, res) => {
//   const { uniqueId } = req.query;
//   if (!uniqueId) {
//     return res.status(400).send("Missing unique Id");
//   }
//   res.render("auth-views/setPassword", { uniqueId });
// });
