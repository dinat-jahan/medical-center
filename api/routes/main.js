require("dotenv").config();
const express = require("express");

const router = express.Router();

const authenticationRoutes = require("./authenticationRoutes");

router.get("/api/whoami", async (req, res) => {
  if (req.session && req.session.user) {
    const user = req.session.user;
    return res.json(user);
  } else {
    return res.json(null);
  }
});

// router.use("/admin/medical", require("./medicalAdminRoutes"));
// router.use("/admin/university", require("./universityAdminRoutes"));
// router.use("/doctor", require("./doctorRoutes"));
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

module.exports = router;
