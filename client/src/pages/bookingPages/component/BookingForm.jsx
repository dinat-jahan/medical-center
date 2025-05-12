import React from "react";
import axios from "axios";
const BookingForm = ({
  doctors,
  setDoctors,
  selectedDoctor,
  setSelectedDoctor,
  selectedDate,
  setSelectedDate,
}) => {
  function getBookableDates(daysAhead = 3) {
    const dates = [];
    const today = new Date();

    for (let i = 0; i <= daysAhead; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]); // "YYYY-MM-DD"
    }

    return dates;
  }

  const availableDates = getBookableDates(2);

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
