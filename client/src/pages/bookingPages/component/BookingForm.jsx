// BookingForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";

const BookingForm = ({
  showDoctorSelect,
  doctors,
  setDoctors,
  selectedDoctor,
  setSelectedDoctor,
  selectedDate,
  setSelectedDate,
  isAdmin,
  isDoctor,
}) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    setMessage("");
  }, [selectedDate, selectedDoctor]);

  const getBookableDates = (daysAhead = 30) => {
    const dates = [];
    const now = DateTime.local();
    const startOffset = now.hour >= 20 ? 1 : 0;
    for (let i = startOffset; i <= daysAhead; i++) {
      dates.push(now.plus({ days: i }).toISODate());
    }
    return dates;
  };
  const availableDates = getBookableDates();

  // For patients/staff, fetch only available doctors
  useEffect(() => {
    if (!selectedDate || isDoctor) return;

    axios
      .get(`/booking/available-doctors?date=${selectedDate}`)
      .then((res) => {
        // res.data.availableDoctors is an array of { doctor, shift } objects
        setDoctors(res.data.availableDoctors);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        setErrorMessage(msg);
        setShowErrorModal(true);
      });
  }, [selectedDate, isDoctor]);

  // Admin day-off placeholder (full-day)
  const handleDayOff = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate) {
      setMessage("Select doctor and date for day off.");
      return;
    }
    try {
      await axios.post("/booking/day-off", {
        doctorId: selectedDoctor,
        date: selectedDate,
      });
      setMessage("Doctor set off for the day.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error setting day off.");
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div>
        <label className="block font-medium">Date:</label>
        <select
          className="border p-2 rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="">Select Date</option>
          {availableDates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      {showDoctorSelect && (
        <div>
          <label className="block font-medium">Doctor:</label>
          <select
            className="border p-2 rounded"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Select Doctor</option>
            {console.log("doctors", doctors)}
            {doctors.map(({ doctor, shift }) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} ({shift})
              </option>
            ))}
          </select>
        </div>
      )}
      {isAdmin && (
        <div className="flex items-end">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            onClick={handleDayOff}
          >
            Set Day Off
          </button>
        </div>
      )}
      {message && <p className="w-full text-red-600 mt-2">{message}</p>}
    </div>
  );
};

export default BookingForm;
