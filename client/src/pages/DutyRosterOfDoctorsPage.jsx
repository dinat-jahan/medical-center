import React, { useState } from "react";

const dutyRoster = {
  Monday: {
    morning: ["Dr. Kawser Ahmed (8.00am - 2.00pm)"],
    evening: [
      "Dr. Nipa Debnath (2.00pm - 8.00pm)",
      "Dr. Harun Or Rashid Rasel (2.00pm - 8.00pm)",
    ],
  },
  Tuesday: {
    morning: [
      "Dr. Kawser Ahmed (8.00am - 2.00pm)",
      "Ahammod Hossain Siddique (8.00am - 2.00pm)",
    ],
    evening: [
      "Dr. Nipa Debnath (2.00pm - 8.00pm)",
      "Dr. Harun Or Rashid Rasel (2.00pm - 8.00pm)",
    ],
  },
  Wednesday: {
    morning: [
      "Dr. Nur Md. Kawsar Abid (9.00am - 5.00pm)",
      "Dr. Kawser Ahmed (8.00am - 2.00pm)",
      "Ahammod Hossain Siddique (8.00am - 2.00pm)",
    ],
    evening: [
      "Dr. Nipa Debnath (2.00pm - 8.00pm)",
      "Dr. Harun Or Rashid Rasel (2.00pm - 8.00pm)",
    ],
  },
  Thursday: { morning: [], evening: [] },
  Friday: {
    morning: ["Dr. Nur Md. Kawsar Abid (9.00am - 5.00pm)"],
    evening: [],
  },
  Saturday: {
    morning: [
      "Dr. Nipa Debnath (8.00am - 2.00pm)",
      "Dr. Kawser Ahmed (8.00am - 2.00pm)",
      "Ahammod Hossain Siddique (8.00am - 2.00pm)",
    ],
    evening: ["Dr. Harun Or Rashid Rasel (2.00pm - 8.00pm)"],
  },
  Sunday: {
    morning: [
      "Dr. Kawser Ahmed (8.00am - 2.00pm)",
      "Ahammod Hossain Siddique (8.00am - 2.00pm)",
    ],
    evening: [
      "Dr. Nipa Debnath (2.00pm - 8.00pm)",
      "Dr. Harun Or Rashid Rasel (2.00pm - 8.00pm)",
    ],
  },
};

const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const Modal = ({ day, roster, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-white-500 bg-teal-700 border-none w-6">✕</button>
      <h3 className="text-2xl font-bold mb-4 text-teal-500">{day} - Full Roster</h3>
      <div className="mb-3">
        <h4 className="font-bold text-xl text-teal-700">Morning Shift:</h4>
        {roster.morning.length ? (
          <ul className="list-disc list-inside text-gray-700">
            {roster.morning.map((doc, idx) => <li key={idx}>{doc}</li>)}
          </ul>
        ) : <p className="text-gray-700 italic">No doctors available</p>}
      </div>
      <div>
        <h4 className="font-bold text-xl text-teal-700">Evening Shift:</h4>
        {roster.evening.length ? (
          <ul className="list-disc list-inside text-gray-700">
            {roster.evening.map((doc, idx) => <li key={idx}>{doc}</li>)}
          </ul>
        ) : <p className="text-gray-500 italic">No doctors available</p>}
      </div>
    </div>
  </div>
);

const DutyRosterOfDoctorsPage = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-teal-500 mb-8">
        Doctors Duty Roster (Weekly View)
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-white rounded-xl shadow hover:shadow-lg p-5 cursor-pointer transition"
            onClick={() => setSelectedDay(day)}
          >
            <h3 className="text-xl font-semibold text-[#0e7660] mb-3">{day}</h3>
            <p className="text-gray-700 text-sm">
              Morning: Doctors<br />
              Evening: Doctors
            </p>
          </div>
        ))}
      </div>

      {selectedDay && (
        <Modal
          day={selectedDay}
          roster={dutyRoster[selectedDay]}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default DutyRosterOfDoctorsPage;
