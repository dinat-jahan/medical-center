import React from "react";
import axios from "axios";
import { DateTime } from "luxon";
const BookingForm = ({
  doctors,
  setDoctors,
  selectedDoctor,
  setSelectedDoctor,
  selectedDate,
  setSelectedDate,
}) => {
  function getBookableDates(daysAhead = 7) {
    const dates = [];
    const now = DateTime.local();
    const startOffset = now.hour >= 20 ? 1 : 0; // if it's 8 PM or later, skip today

    for (let i = startOffset; i <= daysAhead; i++) {
      const date = now.plus({ days: i });
      dates.push(date.toISODate()); // "YYYY-MM-DD"
    }

    return dates;
  }

  const availableDates = getBookableDates(7);

  return (
    <div className="flex gap-4 mb-4">
      <label htmlFor="">Appoinment Date:</label>
      <select
        className="border p-2 rounded"
        onChange={(e) => {
          const selected = e.target.value;
          setSelectedDate(selected);
          axios
            .get(`/booking/available-doctors?date=${selected}`)
            .then((res) => {
              console.log(res.data.availableDoctors);
              setDoctors(res.data.availableDoctors);
            });
        }}
      >
        <option value="">Select Date</option>
        {availableDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
      <label>Doctor:</label>
      <select
        className="border p-2 rounded"
        onChange={(e) => setSelectedDoctor(e.target.value)}
      >
        <option value="">Select Doctor</option>
        {doctors.map((doc, index) => {
          if (!doc?.doctor) return null; // skip if doctor is missing

          return (
            <option value={doc.doctor._id} key={doc.doctor._id}>
              {doc.doctor.name} ({doc.shift})
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default BookingForm;
