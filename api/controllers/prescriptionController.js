require("dotenv").config();

const MedicalUser = require("../models/medicalUser");
const Medicine = require("../models/medicine");
const Prescription = require("../models/prescription");
const Diagnosis = require("../models/diagnosis");
const DispenseRecord = require("../models/dispenseRecord");
const { calculateAge } = require("../helper/prescriptionMethods");

//get patientinfo
exports.getPatientInfo = async (req, res) => {
  try {
    const patient = await MedicalUser.findOne({
      uniqueId: req.params.uniqueId,
    }).lean();
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.age = calculateAge(patient.dob);
    res.status(200).json({ patient });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error fetching patient" });
  }
};

// GET /diagnoses?search=term
// Returns all diagnoses matching `search` against name or displayName
exports.listDiagnoses = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const regex = new RegExp(search.trim(), "i");
    const list = await Diagnosis.find({
      $or: [
        { name: regex },
        {
          displayName: regex,
        },
      ],
    })
      .sort({ displayName: 1 })
      .limit(50);

    res.json(list);
  } catch (err) {
    console.error("Error listing diagnoses:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /diagnoses
// Creates a new Diagnosis
exports.createDiagnosis = async (req, res) => {
  try {
    const { code, name, displayName, notes } = req.body;
    if (!name || !displayName) {
      return res
        .status(400)
        .json({ error: "name and displayName are required" });
    }
    const diag = new Diagnosis({ code, name, displayName, notes });
    console.log(diag);
    await diag.save();
    res.status(201).json(diag);
  } catch (err) {
    console.error("Error creating diagnosis:", err);
    // Duplicate code or name
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "Diagnosis code or name must be unique" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/medicines?search=term
// Returns all medicines matching `search` with monthlyStockQuantity
exports.getMedicine = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const regex = new RegExp(search.trim(), "i");
    const meds = await Medicine.find({
      $or: [{ name: regex }, { genericName: regex }, { dosage: regex }],
    })
      .select("name genericName dosage monthlyStockQuantity _id")
      .limit(50)
      .lean();
    res.json(meds);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/prescriptions
// Creates a new prescription with medicines array
exports.postPrescription = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      date = new Date(),
      diagnoses = [],
      age,
      followUpDate,
      advice = "",
      medicines = [], // front-end items: [{ medicine, medicineName, dose, frequency, startDate, durationDays, requestedQuantity, internalQuantity, dispensedFrom, comments }]
    } = req.body;

    // Build medicine sub-documents for the Prescription
    const prescriptionMeds = medicines.map((m) => {
      const requested = parseInt(m.requestedQuantity, 10) || 0;
      const internalQ =
        m.dispensedFrom === "internal"
          ? parseInt(m.internalQuantity, 10) || 0
          : 0;
      return {
        medicine: m.medicine || null,
        medicineName: m.medicineName,
        dose: m.dose || "",
        frequency: m.frequency,
        startDate: m.startDate ? new Date(m.startDate) : date,
        duration: String(m.durationDays || ""),
        requestedQuantity: requested,
        internalQuantity: internalQ,
        externalQuantity: requested - internalQ,
        comments: m.comments || "",
        dispensedFrom: m.dispensedFrom,
      };
    });

    // Save Prescription
    const prescription = new Prescription({
      patient,
      doctor,
      date,
      diagnoses,
      age,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      advice,
      medicines: prescriptionMeds,
    });
    await prescription.save();
    let dispenseRecord = null;
    const internalMeds = prescription.medicines.filter(
      (m) => m.dispensedFrom === "internal"
    );
    if (internalMeds.length > 0) {
      // Create initial DispenseRecord stub for pharmacy processing
      const dispenseItems = internalMeds.map((m) => ({
        medicine: m.medicine,

        quantity: m.internalQuantity,
        status: "pending",
      }));

      const overallStatus = dispenseItems.every((item) => item.quantity === 0)
        ? "pending"
        : "partial";

      dispenseRecord = new DispenseRecord({
        prescription: prescription._id,
        patient,
        pharmacyStaff: null, // to be set when staff fulfills
        medicines: dispenseItems,
        overallStatus,
      });

      await dispenseRecord.save();
    }
    console.log(prescription);
    console.log(dispenseRecord);
    // Return both records
    res.status(201).json({ prescription, dispenseRecord });
  } catch (err) {
    console.error("Error creating prescription and dispense record:", err);
    res.status(500).json({ error: "Server error" });
  }
};
