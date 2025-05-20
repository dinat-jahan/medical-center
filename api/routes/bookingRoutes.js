require("dotenv").config();
const express = require("express");
const MedicalUser = require("../models/medicalUser");
const DutyRosterDoctor = require("../models/dutyRosterDoctor");
const { DateTime } = require("luxon");
const router = express.Router();
const {
  generateTimeSlots,
  convertToMinutes,
} = require("../helper/bookingMethods");
const { TimeSlot } = require("../models/timeslot");
const { DoctorDayOff } = require("../models/timeslot");
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

// POST mark day off
router.post("/day-off", async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;
    if (!doctorId || !date)
      return res.status(400).json({ message: "doctorId and date required" });
    const day = DateTime.fromISO(date).startOf("day").toJSDate();
    const off = await DoctorDayOff.findOneAndUpdate(
      { doctor: doctorId, date: day },
      { reason },
      { upsert: true, new: true }
    );
    res.json({ message: "Day off set", off });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error setting day off", error: err.message });
  }
});

router.get("/available-doctors", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const selectedDate = DateTime.fromISO(date).setZone("Asia/Dhaka");
    const dayofWeek = selectedDate.toFormat("cccc"); // gives "Monday", etc.
    console.log(dayofWeek);
    const roster = await DutyRosterDoctor.find({ day: dayofWeek }).populate(
      "doctor"
    );
    console.log(roster);
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
    if (!doctorId || !date) {
      return res.status(400).json({ error: "doctor and date required" });
    }

    // Parse and normalize date
    const selectedDate = DateTime.fromISO(date, { zone: "Asia/Dhaka" }).startOf(
      "day"
    );
    const baseDate = selectedDate.toJSDate();
    const dayOfWeek = selectedDate.toFormat("cccc");
    const today = DateTime.local().setZone("Asia/Dhaka");
    const isToday = selectedDate.hasSame(today, "day");

    // Full-day off check
    const offRecord = await DoctorDayOff.findOne({
      doctor: doctorId,
      date: baseDate,
    });
    if (offRecord) {
      return res.json({
        message: "Doctor is off for the day",
        slots: [],
      });
    }

    // Validate doctor
    const doctor = await MedicalUser.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Find duty roster
    const rosterEntry = await DutyRosterDoctor.findOne({
      doctor: doctorId,
      day: dayOfWeek,
    });
    if (!rosterEntry) {
      return res
        .status(404)
        .json({ message: "Doctor is not on duty that day" });
    }

    // Generate time slots
    let times = generateTimeSlots(
      rosterEntry.startTime,
      rosterEntry.endTime,
      10,
      baseDate
    );
    times.sort((a, b) => convertToMinutes(a) - convertToMinutes(b));

    // Ensure slots in DB and build response
    const slots = await Promise.all(
      times.map(async (timeStr, idx) => {
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
            queueNumber: idx + 1,
          });
          await slot.save();
        }

        // Past slot unavailable
        const slotDT = DateTime.fromFormat(
          `${date} ${timeStr}`,
          "yyyy-MM-dd h:mm a",
          { zone: "Asia/Dhaka" }
        );
        if (isToday && slotDT < today && slot.status === "available") {
          slot.status = "unavailable";
          await slot.save();
        }

        // Populate booking info
        await slot.populate("bookedBy", "uniqueId name");
        return {
          _id: slot._id,
          time: slot.time,
          status: slot.status,
          bookingStatus: slot.bookingStatus,
          bookedBy: slot.bookedBy
            ? {
                id: slot.bookedBy._id,
                uniqueId: slot.bookedBy.uniqueId,
                name: slot.bookedBy.name,
              }
            : null,
          queueNumber: slot.queueNumber,
        };
      })
    );

    res.json(slots);
  } catch (err) {
    console.error("Error in /booking/slots:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//handle booking a slot
router.post("/book/:slotId", async (req, res) => {
  const { slotId } = req.params;
  const { patientId, date } = req.body;
  console.log(date);

  try {
    // Check if the patient already has a booking on the same date
    const existingBooking = await TimeSlot.findOne({
      bookedBy: patientId,
      date: date,
      bookingStatus: "booked", // only count slots that are still booked!
    });
    console.log(existingBooking);
    if (existingBooking) {
      return res.status(400).json({
        message: "You have already booked a slot for this day.",
      });
    }
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
    await slot.populate("bookedBy", "uniqueId name");
    const returned = {
      _id: slot._id,
      time: slot.time,
      status: slot.status,
      bookingStatus: slot.bookingStatus,
      bookedBy: {
        id: slot.bookedBy._id,
        uniqueId: slot.bookedBy.uniqueId,
        name: slot.bookedBy.name,
      },
      queueNumber: slot.queueNumber,
    };
    res.json({ message: "Booked", slot: returned });
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
    // if (
    //   slot.bookingStatus !== "booked" ||
    //   !slot.bookedBy ||
    //   slot.bookedBy.toString() !== patientId
    // ) {
    //   return res
    //     .status(400)
    //     .json({ message: "You cannot cancel this booking" });
    // }

    slot.status = "available";
    slot.bookingStatus = "";
    slot.bookedBy = null;

    await slot.save();
    const returned = {
      _id: slot._id,
      time: slot.time,
      status: slot.status,
      bookingStatus: slot.bookingStatus,
      bookedBy: null,
      queueNumber: slot.queueNumber,
    };
    res.json({ message: "Booking canceled successfully", slot: returned });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error canceling the booking", error: error.message });
  }
});

// POST admin unavailable slot
router.post("/unavailable/:slotId", async (req, res) => {
  const { slotId } = req.params;
  try {
    const slot = await TimeSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    slot.status = "unavailable";
    await slot.save();
    await slot.populate("bookedBy", "uniqueId name");
    const returned = {
      _id: slot._id,
      time: slot.time,
      status: slot.status,
      bookingStatus: slot.bookingStatus,
      bookedBy: slot.bookedBy
        ? {
            id: slot.bookedBy._id,
            uniqueId: slot.bookedBy.uniqueId,
            name: slot.bookedBy.name,
          }
        : null,
      queueNumber: slot.queueNumber,
    };
    res.json({ message: "Slot set unavailable", slot: returned });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error setting unavailable", error: err.message });
  }
});

router.post("/mark-seen/:slotId", async (req, res) => {
  const { slotId } = req.params;

  try {
    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    slot.status = "seen"; // Or whatever status value you want
    await slot.save();

    res.json({ slot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
