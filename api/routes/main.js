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

router.get("/api/duty-roster", async (req, res) => {
  try {
    const dutyRoster = await DutyRosterDoctor.aggregate([
      {
        $lookup: {
          from: "medicalusers", // The collection that stores doctors
          localField: "doctor", // The field in the DutyRosterDoctor collection
          foreignField: "_id", // The field in the MedicalUser collection
          as: "doctorDetails", // The alias for the populated data
        },
      },
      {
        $unwind: "$doctorDetails", // Unwind the populated doctor details array
      },
      {
        $group: {
          _id: "$day", // Group by day of the week
          morning: {
            $push: {
              doctor: "$doctorDetails.name", // Include doctor name
              startTime: "$startTime",
              endTime: "$endTime",
            },
          },
          evening: {
            $push: {
              doctor: "$doctorDetails.name", // Include doctor name
              startTime: "$startTime",
              endTime: "$endTime",
            },
          },
        },
      },
      { $sort: { _id: 1 } }, // Sort days of the week
    ]);

    console.log(dutyRoster);
    res.json(dutyRoster); // Return the data as a JSON response
  } catch (err) {
    res.status(500).json({ error: err.message });
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

module.exports = router;
