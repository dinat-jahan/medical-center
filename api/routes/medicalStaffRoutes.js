const express = require("express");
const router = express.Router();
const Medicine = require("../models/medicine");

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
router.put("/medicines/:id", medicineController.updateMedicine);
router.delete("/medicines/:id", medicineController.deleteMedicine);
router.get("/search-medicine", medicineController.searchMedicine);
module.exports = router;
