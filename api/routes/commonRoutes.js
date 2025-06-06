require("dotenv").config();
const express = require("express");
const router = express.Router();
const MedicalUser = require("../models/medicalUser");
const DutyRosterDoctor = require("../models/dutyRosterDoctor");
const TimeSlot = require("../models/timeslot");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectAclCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");
const TelemedicineDuty = require("../models/telemedicineDuty");
const { Test } = require("../models/diagnosis");
const DutyRoster = require("../models/dutyRoster");
const { AmbulanceAssignment } = require("../models/driver");
router.get("/whoami", async (req, res) => {
  console.log("=== WHOAMI ROUTE HIT ===");
  console.log("Cookies:", req.cookies);
  console.log("Session:", req.session);
  if (req.session && req.session.user) {
    const user = req.session.user;
    console.log("user", user);
    return res.json(user);
  } else {
    console.log("no user");
    return res.json(null);
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await MedicalUser.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.photo) {
      user.photoUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: user.photo,
        })
      );
    } else {
      user.photoUrl = null;
    }
    console.log(user);

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await MedicalUser.find({ role: "doctor" }).lean();

    if (doctors.length === 0) {
      return res.status(404).json({
        message: "doctors not found",
        patient: null,
      });
    }
    // Add photo URL for each patient in the result
    for (let doctor of doctors) {
      const photoUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: doctor.photo,
        })
      );
      doctor.photoUrl = photoUrl;
    }
    console.log(doctors);

    // Return the list of patients and success message
    return res.json({
      doctors: doctors,

      message: "doctors found successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred while searching for the patient",
      error: err.message,
    });
  }
});

router.get("/medical-staff", async (req, res) => {
  try {
    const staff = await MedicalUser.find({ role: "medical-staff" }).lean();

    if (staff.length === 0) {
      return res.status(404).json({
        message: "No medical staff found",
        staff: null,
      });
    }

    for (let member of staff) {
      const photoUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: member.photo,
        })
      );
      member.photoUrl = photoUrl;
    }

    return res.json({
      staff,
      message: "Medical staff found successfully",
    });
  } catch (err) {
    console.error("Error fetching medical staff:", err);
    return res.status(500).json({
      message: "An error occurred while fetching medical staff",
      error: err.message,
    });
  }
});

router.get("/duty-roster-doctor", async (req, res) => {
  try {
    const entries = await DutyRosterDoctor.find()
      .populate("doctor", "name")
      .sort({ day: 1, shift: 1, startTime: 1 });
    res.json({ dutyRosterDoctor: entries });
  } catch (err) {
    console.error("Error fetching roster:", err);
    res.status(500).json({ message: "Server error loading roster" });
  }
});

router.get("/doctor-list", async (req, res) => {
  try {
    const dutyRosterDoctor = await DutyRosterDoctor.find().populate("doctor");
    res.json(dutyRosterDoctor);
  } catch (err) {
    console.log(err);
  }
});

router.get("/telemedicine-duty", async (req, res) => {
  try {
    // Find all duties, populate doctor info
    const duties = await TelemedicineDuty.find({})
      .populate({
        path: "doctor",
        select: "name phone role", // select needed fields
        match: { role: "doctor" }, // ensure only doctors
      })
      .lean();

    // Filter out any duties where doctor was not found or not role doctor
    const filteredDuties = duties.filter((duty) => duty.doctor);

    // Map to desired format
    const responseDuties = filteredDuties.map(({ day, doctor }) => ({
      day,
      doctor: {
        name: doctor.name,
        phone: doctor.phone,
      },
    }));

    res.json({ duties: responseDuties });
  } catch (err) {
    console.error("Error fetching telemedicine duties:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/telemedicine/doctors-today", async (req, res) => {
  try {
    // Get current weekday string, e.g. "Tuesday"
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = weekdays[new Date().getDay()];

    // Find all duties for today's day and populate doctor info
    const duties = await TelemedicineDuty.find({ day: today }).populate({
      path: "doctor",
      select: "name phone role", // pick only needed fields
      match: { role: "doctor" }, // optional: ensure only doctors
    });

    // Extract doctors info, filter out any nulls if doctor reference missing
    const doctors = duties
      .map((duty) => duty.doctor)
      .filter((doc) => doc !== null);
    console.log(doctors);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching telemedicine doctors for today:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Express.js example route
router.get("/pathology-tests", async (req, res) => {
  try {
    console.log("inside");
    const tests = await Test.find({ availableInMedicalCenter: false });

    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

function parseMonth(str) {
  const [year, mon] = str.split("-").map((n) => parseInt(n, 10));
  return new Date(year, mon - 1, 1);
}

//get current driver
router.get("/ambulance/current-driver", async (req, res) => {
  try {
    const monthParam = req.query.month || new Date().toISOString().slice(0, 7);
    const monthDate = parseMonth(monthParam);
    const assignment = await AmbulanceAssignment.findOne({
      month: monthDate,
    }).populate("drivers");
    res.json({ drivers: assignment ? assignment.drivers : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 1) Get distinct departments from roster
router.get("/departments", async (req, res) => {
  try {
    const departments = await DutyRoster.distinct("department");
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching departments" });
  }
});

// 2) Get staff list by department
router.get("/staff/:department", async (req, res) => {
  try {
    const { department } = req.params;

    // Find distinct staff IDs in this department
    const staffIds = await DutyRoster.find({ department }).distinct("staff");

    // Find staff user info
    const staff = await MedicalUser.find({ _id: { $in: staffIds } }).select(
      "name role"
    );

    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching staff" });
  }
});

// 3) Get duty roster grouped by day and shift for a department
router.get("/roster/:department", async (req, res) => {
  try {
    const { department } = req.params;

    const rosters = await DutyRoster.find({ department }).populate(
      "staff",
      "name"
    );

    // Group by day and shift
    const grouped = {};

    rosters.forEach((r) => {
      if (!grouped[r.day]) grouped[r.day] = {};
      if (!grouped[r.day][r.shift]) grouped[r.day][r.shift] = [];
      grouped[r.day][r.shift].push(r.staff.name);
    });

    res.json(grouped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching roster" });
  }
});

module.exports = router;
