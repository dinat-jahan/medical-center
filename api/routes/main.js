require("dotenv").config();
const express = require("express");

const router = express.Router();

const authenticationRoutes = require("./authenticationRoutes");

router.use((req, res, next) => {
  res.locals.user = req.session.user || req.user || null;
  next();
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
