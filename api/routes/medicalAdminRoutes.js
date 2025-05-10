const express = require("express");
const MedicalDBAdmin = require("../models/admin");

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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const isMedicalAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "medical-admin") {
    return next();
  }
  return res.status(403).send("Access denied");
};

//show the doctor's duty roster list
router.get("/duty-roster-doctor", isMedicalAdmin, async (req, res) => {
  try {
    const dutyRosterDoctor = await DutyRosterDoctor.find().populate("doctor");
    const doctors = await MedicalUser.find({ role: "doctor" });
    res.json({ dutyRosterDoctor, doctors });
    // console.log("doctors", doctors);
    // console.log("duty roster", dutyRosterDoctor);
  } catch (err) {
    console.log(err);
  }
});

//add a new doctor duty roster entry
router.post("/duty-roster-doctor/add", isMedicalAdmin, async (req, res) => {
  try {
    console.log(req.body);
    const { doctor, day, shift, startTime, endTime } = req.body;
    await DutyRosterDoctor.create({
      doctor,
      day,
      shift,
      startTime,
      endTime,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

//delete a duty roster entry
router.post(
  "/duty-roster-doctor/delete/:id",
  isMedicalAdmin,
  async (req, res) => {
    try {
      await DutyRosterDoctor.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
    }
  }
);
module.exports = router;
