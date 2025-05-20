require("dotenv").config();
const express = require("express");
const router = express.Router();

const authenticationRoutes = require("./authenticationRoutes");
const MedicalUser = require("../models/medicalUser");
const DutyRosterDoctor = require("../models/dutyRosterDoctor");
const TimeSlot = require("../models/timeslot");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectAclCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");
const TelemedicineDuty = require("../models/telemedicineDuty");
router.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});
router.get("/api/whoami", async (req, res) => {
  if (req.session && req.session.user) {
    const user = req.session.user;
    return res.json(user);
  } else {
    return res.json(null);
  }
});

router.get("/api/profile/:id", async (req, res) => {
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

router.use("/admin/medical", require("./medicalAdminRoutes"));
router.use("/admin/university", require("./universityAdminRoutes"));
router.use("/doctor", require("./doctorRoutes"));
router.use("/patient", require("./patientRoutes"));
router.use("/medical-staff", require("./medicalStaffRoutes"));
router.use("/auth", authenticationRoutes);
router.use("/booking", require("./bookingRoutes"));

// //view doctor list
// router.get("/doctor-list", async (req, res) => {
//   try {
//     const dutyRosterDoctor = await DutyRosterDoctor.find().populate("doctor");
//     res.render("common-views/doctorList", {
//       dutyRosterDoctor,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.get("/api/doctors", async (req, res) => {
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

router.get("/api/medical-staff", async (req, res) => {
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

router.get("/api/duty-roster-doctor", async (req, res) => {
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

router.delete("/delete-all-time-slots", async (req, res) => {
  try {
    await TimeSlot.deleteMany({});
    res.json({ message: "All time slots deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting time slots", error: err.message });
  }
});

router.get("/api/telemedicine-duty", async (req, res) => {
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

module.exports = router;
