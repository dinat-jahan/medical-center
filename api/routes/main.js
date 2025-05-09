require("dotenv").config();
const express = require("express");
const router = express.Router();

const authenticationRoutes = require("./authenticationRoutes");
const MedicalUser = require("../models/medicalUser");
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

// router.use("/admin/medical", require("./medicalAdminRoutes"));
router.use("/admin/university", require("./universityAdminRoutes"));
router.use("/doctor", require("./doctorRoutes"));
// router.use("/patient", require("./patientRoutes"));
// router.use("/medical-staff", require("./medicalStaffRoutes"));
router.use("/auth", authenticationRoutes);

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

module.exports = router;
