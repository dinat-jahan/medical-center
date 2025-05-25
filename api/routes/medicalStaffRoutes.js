const express = require("express");
const router = express.Router();
const Medicine = require("../models/medicine");
const { body, validationResult } = require("express-validator");
const DispenseRecord = require("../models/dispenseRecord");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectAclCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");
const medicineController = require("../controllers/medicineController");

const isMedicalStaff = (req, res, next) => {
  console.log(req.session.user);
  if (req.session.user && req.session.user.role === "medical-staff") {
    return next();
  }
  return res.status(403).send("Access denied");
};

router.use(isMedicalStaff);

//pending medicine request routes
router.get("/dispense-records", medicineController.getDispenseReq);
router.patch("/dispense-records/:id", medicineController.changeStatus);
router.post(
  "/dispenses-records/:id/finalize",
  medicineController.changeMonthlyStock
);

//manage medicine routes
router.get("/medicines", medicineController.getAllMedicine);
router.get("/medicines/:id", medicineController.getSingleMedicine);
router.post("/medicines", medicineController.postSingleMedicine);
router.delete("/medicines/:id", medicineController.deleteMedicine);
router.get("/search-medicine", medicineController.searchMedicine);
router.put(
  "/medicines/:id",
  [
    // Allow partial updates: all fields optional
    body("name").optional().isString().trim().notEmpty(),
    body("genericName").optional().isString().trim().notEmpty(),
    body("type").optional().isString().trim().notEmpty(),
    body("mainStockQuantity").optional().isInt({ min: 0 }),
    body("monthlyStockQuantity").optional().isInt({ min: 0 }),
    body("dosage").optional().isString().trim(),
    body("manufacturer").optional().isString().trim(),
    body("price").optional().isFloat({ min: 0 }),
    body("expiryDate").optional().isISO8601(),
    body("batchNumber").optional().isString().trim(),
    body("storageCondition").optional().isString().trim(),
    body("sideEffects").optional().isArray(),
    body("usageInstructions").optional().isString().trim(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  medicineController.updateMedicine
);
// Incremental stock + expiry update
router.patch(
  "/medicines/:id/add-stock",
  [
    body("addedQuantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be non-negative integer"),
    body("expiryDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  medicineController.addStockAndExpiry
);
router.get("/low-stock", medicineController.getLowStockMeds);

//add medicine
router.post("/add-medicine", medicineController.createMedicine);

// routes/medicines.js

router.get("/dispensed-report", async (req, res) => {
  // parse and expand the date range
  const now = new Date();
  const startDate = req.query.start
    ? new Date(req.query.start)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = req.query.end
    ? (() => {
        let d = new Date(req.query.end);
        d.setDate(d.getDate() + 1);
        return d;
      })()
    : now;

  try {
    const report = await DispenseRecord.aggregate([
      {
        $match: {
          overallStatus: "completed",
          dispensedAt: { $gte: startDate, $lt: endDate },
        },
      },
      { $unwind: "$medicines" },
      {
        $group: {
          _id: "$medicines.medicine",
          dispensedQuantity: { $sum: "$medicines.quantity" },
        },
      },
      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicineDoc",
        },
      },
      { $unwind: "$medicineDoc" },
      {
        $project: {
          _id: 0,
          medicineId: "$_id",
          name: "$medicineDoc.name",
          dispensedQuantity: 1,
          remainingMonthlyStock: "$medicineDoc.monthlyStockQuantity",
        },
      },
      { $sort: { dispensedQuantity: -1 } },
    ]);
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
