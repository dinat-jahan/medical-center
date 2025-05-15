const express = require("express");
const session = require("express-session");
const router = express.Router();
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectAclCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");
const MedicalUser = require("../models/medicalUser");
const Prescription = require("../models/prescription");
const prescriptionController = require("../controllers/prescriptionController");

const isPatient = (req, res, next) => {
  //   console.log("Session user in isPatient middleware:", req.user);
  //   console.log("Session user in isPatient middleware:", req.session.user); // Log session user
  // Log session user

  if (req.session.user && req.session.user.role === "patient") {
    return next();
  }
  return res.status(403).send("Access denied");
};

router.get(
  "/prescription-history/:id",
  isPatient,
  prescriptionController.getPrescriptionHistory
);

module.exports = router;
