require("dotenv").config();
const express = require("express");
const MedicalUser = require("../models/medicalUser");
// const DutyRosterDoctor = require("../models/dutyRoster");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectAclCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");
const { calculateAge } = require("../helper/utils");
// const classifiedMedicine = require("../controllers/prescriptionController");
// const Prescription = require("../models/prescription");
const Medicine = require("../models/medicine");
const prescriptionController = require("../controllers/prescriptionController");
const router = express.Router();

const isDoctor = (req, res, next) => {
  if (req.session.user && req.session.user.role === "doctor") {
    return next();
  }
  return res.status(403).send("Access denied");
};

router.get("/search-patient", isDoctor, async (req, res) => {
  const query = req.query.patient;

  try {
    const patients = query
      ? await MedicalUser.find({
          $and: [
            // Search either by uniqueId or name
            {
              $or: [
                { uniqueId: { $regex: query.toString(), $options: "i" } },
                { name: { $regex: query.toString(), $options: "i" } },
              ],
            },
            // Filter out doctors
            { role: { $ne: "doctor" } },
          ],
        })
      : [];

    if (patients.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
        patient: null,
      });
    }
    // Add photo URL for each patient in the result
    for (let patient of patients) {
      patient.photoUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: patient.photo,
        })
      );
    }
    // Return the list of patients and success message
    return res.json({
      patients: patients,
      message: "Patients found successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred while searching for the patient",
      error: err.message,
    });
  }
});

router.get("/patient-profile/:uniqueId", isDoctor, async (req, res) => {
  const { uniqueId } = req.params;

  try {
    // Fetch the patient (non-doctor role)
    const patient = await MedicalUser.findOne({
      uniqueId: uniqueId,
      role: { $ne: "doctor" },
    }).lean();

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // If the patient has a photo, generate a signed URL and add it to the object
    if (patient.photo) {
      patient.photoUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: patient.photo,
        })
      );
      console.log(patient.photoUrl);
    } else {
      // If no photo exists, set photoUrl to null
      patient.photoUrl = null;
    }

    console.log(patient); // Check if photoUrl is added here

    // Return the patient object with the photoUrl included
    return res.json({
      success: true,
      user: patient, // Send the modified patient object
      message: "Patient profile fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred while fetching the patient profile",
      error: err.message,
    });
  }
});

//prescription routes
router.get(
  "/pres/patient-profile/:uniqueId",
  prescriptionController.getPatientInfo
);
// fetch list of diagnoses with optional ?search=
router.get("/diagnoses", prescriptionController.listDiagnoses);

// add a new diagnosis
router.post("/diagnoses", prescriptionController.createDiagnosis);

//search medicine
router.get("/pres/medicines", prescriptionController.getMedicine);

//post prescription
router.post("/create-prescription", prescriptionController.postPrescription);

//show prescription
router.get(
  "/show-prescription/:prescriptionId",
  prescriptionController.getPrescription
);

//get test suggestion
router.get("/tests", prescriptionController.getTests);

//post test as a option
router.post("/tests", prescriptionController.postTests);

//search medicine
router.get("/search-medicine", isDoctor, async (req, res) => {
  try {
    const query = req.query.medicine || ""; // Ensure it's always a string

    const medicines = query
      ? await Medicine.find({
          $or: [
            { name: { $regex: query.toString(), $options: "i" } },
            { genericName: { $regex: query.toString(), $options: "i" } },
            { manufacturer: { $regex: query.toString(), $options: "i" } },
          ],
        })
      : []; // If query is empty, return an empty array

    if (medicines.length === 0) {
      return res.status(404).json({
        message: "medicines not found",
        medicines: null,
      });
    }
    return res.json({
      medicines: medicines,
      message: "medicines found successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error"); // Handle errors properly
  }
});

router.get("/medicine/:medicineId", async (req, res) => {
  const { medicineId } = req.params;
  console.log("inside");
  try {
    const medicine = await Medicine.findById(medicineId); // Assuming you're using MongoDB
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    console.log(medicine);
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: "Error fetching medicine data" });
  }
});

module.exports = router;
