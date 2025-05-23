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
const medicineController = require("../controllers/medicineController");
const router = express.Router();
const Prescription = require("../models/prescription");
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

router.get("/medicines", async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { search, type } = req.query;

    // Build base query
    const query = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: { $regex: regex } },
        { genericName: { $regex: regex } },
      ];
    }
    if (type) {
      query.type = type;
    }

    // Pagination calculations
    const skip = (page - 1) * limit;

    // Fetch paginated medicines
    const medicines = await Medicine.find(query)
      .select("-mainStockQuantity") // hide main stock
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    // (Optional) Total count for UI
    const totalCount = await Medicine.countDocuments(query);

    res.json({
      success: true,
      medicines,
      page,
      limit,
      totalCount,
    });
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.get("/medicines/:id", medicineController.getSingleMedicine);

router.get("/search", async (req, res) => {
  const query = (req.query.q || "").trim();
  if (!query) {
    return res.json({ results: [] });
  }

  const regex = new RegExp(query, "i");

  try {
    // Search only users with role 'patient'
    const [patients, medicines] = await Promise.all([
      MedicalUser.find({
        role: "patient",
        $or: [{ name: regex }, { uniqueId: regex }],
      })
        .limit(10)
        .lean(),

      Medicine.find({
        $or: [{ name: regex }, { genericName: regex }, { manufacturer: regex }],
      })
        .limit(10)
        .lean(),
    ]);

    // Tag items with type
    const patientResults = patients.map((u) => ({
      type: "patient",
      name: u.name,
      uniqueId: u.uniqueId,
      _id: u._id,
    }));

    const medicineResults = medicines.map((m) => ({
      type: "medicine",
      name: m.name,
      genericName: m.genericName,
      manufacturer: m.manufacturer,
      _id: m._id,
    }));

    // Merge and send
    res.json({ results: [...patientResults, ...medicineResults] });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/patient-history/:uniqueId", isDoctor, async (req, res) => {
  try {
    const { uniqueId } = req.params;

    // 1. Find the patient document by uniqueId
    const patient = await MedicalUser.findOne({ uniqueId }).select("_id");
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    // 2. Query prescriptions by the real ObjectId
    const prescriptions = await Prescription.find({
      patient: patient._id,
    })
      .sort({ createdAt: -1 })
      .populate("doctor", "name uniqueId") // optional: pull in doctor info
      .lean();

    return res.json({ success: true, prescriptions });
  } catch (error) {
    console.error("Error fetching patient history:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/my-prescriptions/:id", isDoctor, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.params.id })
      .sort({ createdAt: -1 })
      .populate("patient", "name uniqueId");

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.error("Error fetching doctor prescriptions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
