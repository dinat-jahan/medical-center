const Medicine = require("../models/medicine");
const DispenseRecord = require("../models/dispenseRecord");
const Prescription = require("../models/prescription");

//list all dispense request with optional status filter
exports.getDispenseReq = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.overallStatus = status;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    const skip = (page - 1) * limit;
    const totalCount = await DispenseRecord.countDocuments(filter);
    console.log(totalCount);
    res.set("X-Total-Count", totalCount);

    const records = await DispenseRecord.find(filter)
      .populate("patient", "name")
      .populate("doctor", "name")
      .populate({
        path: "medicines.medicine",
        select: "name dosage",
      })
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.json(records);
  } catch (err) {
    console.error("Error fetching dispense records:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { overallStatus } = req.body;
    const record = await DispenseRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });

    record.overallStatus = overallStatus;
    await record.save();
    return res.json({ record });
  } catch (err) {
    console.error("Error updating dispense record status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.changeMonthlyStock = async (req, res) => {
  try {
    const record = await DispenseRecord.findById(req.params.id).populate(
      "medicines.medicine"
    );
    if (!record) return res.status(404).json({ error: "Record not found" });

    if (record.overallStatus !== "completed") {
      return res
        .status(400)
        .json({ error: "Can only finalize a completed request" });
    }

    if (req.session?.user?.id) {
      record.pharmacyStaff = req.session.user.id;
    }
    record.dispensedAt = new Date();
    await record.save();

    await Promise.all(
      record.medicines.map((item) => {
        const med = item.medicine;
        med.monthlyStockQuantity = Math.max(
          0,
          med.monthlyStockQuantity - item.quantity
        );
        return med.save();
      })
    );
    res.json({ message: "Stock updated and record finalized successfully" });
  } catch (err) {
    console.error("Error finalizing dispense record:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List medicines with optional search, generic name, manufacturer filters and pagination
exports.getAllMedicine = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { genericName: regex },
        { manufacturer: regex },
        { dosage: regex },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const totalItems = await Medicine.countDocuments(query);
    const totalPages = Math.ceil(totalItems / Number(limit));
    const items = await Medicine.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ items, totalPages, totalItems });
  } catch (err) {
    console.error("Error listing medicines:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//get a single medicine
exports.getSingleMedicine = async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ error: "Medicine not found" });
    res.json(med);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//post a new medicine
exports.postSingleMedicine = async (req, res) => {
  try {
    const newMed = new Medicine(req.body);
    await newMed.save();
    res.status(201).json(newMed);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

//update a medicine
exports.updateMedicine = async (req, res) => {
  try {
    const updates = req.body;
    const med = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    console.log(med);
    if (!med) return res.status(404).json({ error: "Medicine not found" });
    res.json(med);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

//delete a medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const med = await Medicine.findByIdAndDelete(req.params.id);
    if (!med) return res.status(404).json({ error: "Medicine not found" });
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

//search medicine
exports.searchMedicine = async (req, res) => {
  try {
    const q = req.query.query || "";
    const regex = new RegExp(q, "i");
    const matched = await Medicine.find({
      $or: [{ name: regex }, { genericName: regex }, { manufacturer: regex }],
    }).limit(50);
    const suggestions = Array.from(
      new Set([
        ...matched.map((m) => m.name),
        ...matched.map((m) => m.genericName),
        ...matched.map((m) => m.manufacturer),
      ])
    ).map((val) => ({ label: val, value: val }));
    res.json(suggestions);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
//get low of stock medicine
exports.getLowStockMeds = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold, 10) || 5;
    const meds = await Medicine.find({
      monthlyStockQuantity: { $lte: threshold },
    }).select(
      "_id name genericName manufacturer type batchNumber expiryDate monthlyStockQuantity"
    );
    res.json(meds);
  } catch (err) {
    console.error("Error fetching low-stock medicines:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Add stock incrementally and update expiry date
 * PATCH /medicines/:id/add-stock
 * Body: { addedQuantity: number, expiryDate: ISODateString }
 */
exports.addStockAndExpiry = async (req, res) => {
  try {
    const { addedQuantity, expiryDate } = req.body;
    const increment = parseInt(addedQuantity, 10) || 0;

    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ error: "Medicine not found" });

    // Increment stock
    med.monthlyStockQuantity = (med.monthlyStockQuantity || 0) + increment;
    // Update expiry
    if (expiryDate) med.expiryDate = new Date(expiryDate);

    await med.save();
    res.json(med);
  } catch (err) {
    console.error("Error adding stock to medicine:", err);
    res.status(500).json({ error: "Server error" });
  }
};
