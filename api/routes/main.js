require("dotenv").config();
const express = require("express");
const router = express.Router();

const authenticationRoutes = require("./authenticationRoutes");

router.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

router.use("/admin/medical", require("./medicalAdminRoutes"));
router.use("/admin/university", require("./universityAdminRoutes"));
router.use("/doctor", require("./doctorRoutes"));
router.use("/patient", require("./patientRoutes"));
router.use("/medical-staff", require("./medicalStaffRoutes"));
router.use("/auth", authenticationRoutes);
router.use("/booking", require("./bookingRoutes"));
router.use("/api", require("./commonRoutes"));

module.exports = router;
