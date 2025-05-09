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

// //post a prescription
// router.get("/write-prescription/:id", isDoctor, async (req, res) => {
//   try {
//     const patient = await UsersModel2.findById(req.params.id);
//     patient.age = calculateAge(patient.dob);

//     res.render("doctor-views/createPrescription", {
//       patient: patient,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// // Handle prescription form submission
// router.post("/write-prescription/:id", isDoctor, async (req, res) => {
//   try {
//     const patient = await UsersModel2.findById(req.params.id);
//     patient.age = calculateAge(patient.dob);

//     const { diagnosis, followUpDate, advice } = req.body;
//     console.log(req.body);

//     // Process medicines data into an array of objects
//     const medicines = Object.keys(req.body)
//       .filter((key) => key.startsWith("medicines[")) // Filters out medicine fields
//       .reduce((acc, key) => {
//         // Extract the index and the field name (e.g., 'medicines[0].drugName' -> index=0, field='drugName')
//         const match = key.match(/medicines\[(\d+)\]\.(\w+)/);
//         if (match) {
//           const index = match[1]; // Extract the index of the medicine (e.g., '0', '1', etc.)
//           const field = match[2]; // Extract the field name (e.g., 'drugName', 'dose', etc.)

//           if (!acc[index]) {
//             acc[index] = {}; // Initialize a new medicine object if it's the first field for this index
//           }

//           acc[index][field] = req.body[key]; // Assign the field value to the correct medicine object
//         }
//         return acc;
//       }, []);

//     // Now 'medicines' will contain an array of medicine objects
//     console.log(medicines);

//     // Ensure medicines is an array
//     let classifiedMedicines = [];
//     if (Array.isArray(medicines)) {
//       classifiedMedicines = await classifiedMedicine(medicines); // Classify medicines
//     }

//     // Create and save the prescription
//     const prescription = new Prescription({
//       patient,
//       doctor: req.session.user.id,
//       diagnosis,
//       age: patient.age,
//       medicines: classifiedMedicines,
//       followUpDate,
//       advice,
//     });

//     await prescription.save();

//     // Render the prescription page
//     res.render("doctor-views/showPrescription", {
//       patient: patient,
//       prescription: prescription,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// //see available-medicine
// router.get("/available-medicine", isDoctor, async (req, res) => {
//   try {
//     const medicines = await Medicine.find();
//     res.render("doctor-views/availableMedicines", {
//       medicines: medicines,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// //search medicine
// router.get("/search-medicine", isDoctor, async (req, res) => {
//   try {
//     const query = req.query.medicine || ""; // Ensure it's always a string

//     const medicines = query
//       ? await Medicine.find({
//           $or: [
//             { name: { $regex: query.toString(), $options: "i" } },
//             { genericName: { $regex: query.toString(), $options: "i" } },
//             { manufacturer: { $regex: query.toString(), $options: "i" } },
//           ],
//         })
//       : []; // If query is empty, return an empty array

//     res.render("doctor-views/searchMedicine", { medicines });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error"); // Handle errors properly
//   }
// });

module.exports = router;
