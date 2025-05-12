require("dotenv").config();
const express = require("express");
const MedicalUser = require("../models/medicalUser");
const DutyRosterDoctor = require("../models/dutyRosterDoctor");
const router = express.Router();
const {
  generateTimeSlots,
  convertToMinutes,
} = require("../helper/bookingMethods");
const TimeSlot = require("../models/timeslot");
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await MedicalUser.find({ role: "doctor" }).lean();

    if (doctors.length === 0) {
      return res.status(404).json({
        message: "doctors not found",
        patient: null,
      });
    }

    // Return the list of patients and success message
    return res.json({
      doctors,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred while searching for the patient",
      error: err.message,
    });
  }
});

router.get("/available-doctors", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const selectedDate = new Date(date);
    const dayofWeek = selectedDate.toLocaleDateString("en-us", {
      weekday: "long",
    });

    const roster = await DutyRosterDoctor.find({ day: dayofWeek }).populate(
      "doctor"
    );

    res.json({ availableDoctors: roster });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

//get time slot for doctors and dates
router.get("/slots", async (req, res) => {
  try {
    const { doctor: doctorId, date } = req.query;

    // console.log("Doctor ID:", doctorId);
    // console.log("Date string from frontend:", date);
    if (!doctorId || !date) {
      return res.status(400).json({ error: "doctor and date are required" });
    }

    const doctor = await MedicalUser.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const rosterEntry = await DutyRosterDoctor.findOne({
      doctor: doctorId,
      day: dayOfWeek,
    });

    if (!rosterEntry) {
      return res.status(404).json({ error: "Doctor is not on duty that day" });
    }
    const baseDate = new Date(date);
    // Step 1: Generate all time slots
    let timeSlots = generateTimeSlots(
      rosterEntry.startTime,
      rosterEntry.endTime,
      10,
      baseDate
    );

    // Step 2: Sort time slots chronologically
    timeSlots.sort((a, b) => convertToMinutes(a) - convertToMinutes(b));

    // Step 3: Create time slots in DB if not exists, assign correct queueNumber
    const slotPromises = timeSlots.map(async (timeStr, index) => {
      let slot = await TimeSlot.findOne({
        doctor: doctorId,
        date,
        time: timeStr,
      });
      if (!slot) {
        slot = new TimeSlot({
          doctor: doctorId,
          date,
          time: timeStr,
          queueNumber: index + 1,
        });
        await slot.save();
      }

      return {
        _id: slot._id,
        time: slot.time,
        status: slot.status,
        bookingStatus: slot.bookingStatus,
        bookedBy: slot.bookedBy,
        queueNumber: slot.queueNumber,
      };
    });

    const slots = await Promise.all(slotPromises);
    // console.log(slots);
    res.json(slots);
  } catch (err) {
    console.error("Error in /booking/slots:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//handle booking a slot
router.post("/book/:slotId", async (req, res) => {
  const { slotId } = req.params;
  const { patientId } = req.body;
  console.log(patientId);

  try {
    const slot = await TimeSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if the slot is already booked
    if (slot.bookingStatus === "booked") {
      return res.status(400).json({ message: "Slot already booked" });
    }
    slot.status = "unavailable";
    slot.bookingStatus = "booked";
    slot.bookedBy = patientId;
    console.log(slot);
    await slot.save();
    res.json({ message: "Slot booked successfully", slot });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error booking the slot", error: error.message });
  }
});

//handle canceling a booking
router.post("/cancel/:slotId", async (req, res) => {
  const { slotId } = req.params;
  const { patientId } = req.body;
  console.log(slotId);
  try {
    const slot = await TimeSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if the slot is not booked or booked by a different patient
    if (
      slot.bookingStatus !== "booked" ||
      slot.bookedBy.toString() !== patientId
    ) {
      return res
        .status(400)
        .json({ message: "You cannot cancel this booking" });
    }
    slot.status = "available";
    slot.bookingStatus = "";
    slot.bookedBy = null;

    await slot.save();
    res.json({ message: "Booking canceled successfully", slot });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error canceling the booking", error: error.message });
  }
});

module.exports = router;
