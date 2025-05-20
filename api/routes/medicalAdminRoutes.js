const express = require("express");
const MedicalDBAdmin = require("../models/admin");
const mongoose = require("mongoose");

const router = express.Router();
const UniversityMember = require("../models/universityMember");
const MedicalUser = require("../models/medicalUser");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  GetObjectAclCommand,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");
const DutyRosterDoctor = require("../models/dutyRosterDoctor");
const { generateFileName } = require("../helper/utils");
const multer = require("multer");
const DutyRoster = require("../models/dutyRoster");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const TelemedicineDuty = require("../models/telemedicineDuty");
const isMedicalAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "medical-admin") {
    return next();
  }
  return res.status(403).send("Access denied");
};

// Fetch all duty entries and list of doctors
router.get("/duty-roster-doctor", isMedicalAdmin, async (req, res) => {
  try {
    const dutyRosterDoctor = await DutyRosterDoctor.find().populate("doctor");
    const doctors = await MedicalUser.find({ role: "doctor" });
    res.json({ dutyRosterDoctor, doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new duty entry
router.post("/duty-roster-doctor/add", isMedicalAdmin, async (req, res) => {
  try {
    const { doctor, day, shift, startTime, endTime } = req.body;
    // check for existing
    const exists = await DutyRosterDoctor.findOne({ doctor, day, shift });
    if (exists) {
      return res.status(400).json({
        error: "That doctor is already scheduled for this day & shift.",
      });
    }
    const newDuty = await DutyRosterDoctor.create({
      doctor,
      day,
      shift,
      startTime,
      endTime,
    });
    await newDuty.populate("doctor");
    res.status(200).json(newDuty);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "That doctor is already scheduled for this day & shift.",
      });
    }
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// Delete a duty entry by ID
router.post(
  "/duty-roster-doctor/delete/:id",
  isMedicalAdmin,
  async (req, res) => {
    try {
      await DutyRosterDoctor.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error." });
    }
  }
);

// Helper to normalize department strings (trim + lowercase)
function normalizeDept(dept) {
  return dept ? dept.trim().toLowerCase() : null;
}

// Get duties for a given normalized department
router.get("/duty-roster", isMedicalAdmin, async (req, res) => {
  try {
    let { department } = req.query;
    if (!department)
      return res.status(400).json({ error: "Department is required" });
    department = normalizeDept(department);

    const duties = await DutyRoster.find({ department }).populate(
      "staff",
      "_id name department"
    );
    res.json(duties);
  } catch (err) {
    console.error("GET /duty-roster error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get medical staff users by normalized department
router.get("/medical-users", isMedicalAdmin, async (req, res) => {
  try {
    let { department } = req.query;
    if (!department)
      return res.status(400).json({ error: "Department is required" });
    department = normalizeDept(department);

    const staff = await MedicalUser.find({
      userType: "staff",
      department,
    }).select("_id name department");
    res.json(staff);
  } catch (err) {
    console.error("GET /medical-users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add new staff duty roster record with normalized department
router.post("/duty-roster/add", isMedicalAdmin, async (req, res) => {
  try {
    console.log("inside add");
    console.log(req.body);
    let { staff, department, day, shift, startTime, endTime } = req.body;

    if (!staff || !department || !day || !shift || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(staff)) {
      return res.status(400).json({ error: "Invalid staff ID" });
    }
    department = normalizeDept(department);

    const exists = await DutyRoster.findOne({ staff, day, shift });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Staff already scheduled for this day & shift" });
    }

    const newDuty = await DutyRoster.create({
      staff,
      department,
      day,
      shift,
      startTime,
      endTime,
    });
    await newDuty.populate("staff", "_id name department");
    res.json(newDuty);
  } catch (err) {
    console.error("POST /duty-roster/add error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate duty entry" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Delete staff duty roster record by ID
router.post("/duty-roster/delete/:id", isMedicalAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid duty record ID" });
    }
    await DutyRoster.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("POST /duty-roster/delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all duties with doctor populated + all doctors with role "doctor"
router.get("/telemedicine-duty", async (req, res) => {
  try {
    const duties = await TelemedicineDuty.find()
      .populate("doctor", "name phone") // populate only name and phone fields
      .sort({ day: 1 });

    const doctors = await MedicalUser.find({ role: "doctor" }).select(
      "name phone"
    );

    res.json({ duties, doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch duties" });
  }
});

// Add a duty
router.post("/telemedicine-duty/add", async (req, res) => {
  const { day, doctor } = req.body;
  try {
    const exists = await TelemedicineDuty.findOne({ day, doctor });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Doctor already assigned for this day" });
    }
    const newDuty = await TelemedicineDuty.create({ day, doctor });
    const populated = await newDuty.populate("doctor");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign duty" });
  }
});

// Remove a duty
router.post("/telemedicine-duty/delete/:id", async (req, res) => {
  try {
    await TelemedicineDuty.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove duty" });
  }
});
module.exports = router;
