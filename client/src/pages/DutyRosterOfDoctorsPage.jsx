import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Modal component with click-outside-to-close
const Modal = ({ day, roster, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg relative overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-teal-700 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm"
        >
          ×
        </button>
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-teal-500">
          {day} - Full Roster
        </h3>
        {/* Only render if shift exists */}
        {roster.morning.length > 0 && (
          <section className="mb-4">
            <h4 className="font-bold text-lg sm:text-xl text-teal-700">
              Morning Shift:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              {roster.morning.map((doc, idx) => (
                <li key={idx} className="text-sm sm:text-base">
                  {doc}
                </li>
              ))}
            </ul>
          </section>
        )}
        {roster.evening.length > 0 && (
          <section className="mb-4">
            <h4 className="font-bold text-lg sm:text-xl text-teal-700">
              Evening Shift:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              {roster.evening.map((doc, idx) => (
                <li key={idx} className="text-sm sm:text-base">
                  {doc}
                </li>
              ))}
            </ul>
          </section>
        )}
        {roster.fullDay && roster.fullDay.length > 0 && (
          <section>
            <h4 className="font-bold text-lg sm:text-xl text-teal-700">
              Full Day:
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              {roster.fullDay.map((doc, idx) => (
                <li key={idx} className="text-sm sm:text-base">
                  {doc}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

const DutyRosterOfDoctorsPage = () => {
  const daysOfWeek = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const [rosters, setRosters] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { morning: [], evening: [], fullDay: [] },
      }),
      {}
    )
  );
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const { data } = await axios.get("/api/duty-roster-doctor");
        const entries = data.dutyRosterDoctor || [];

        const grouped = daysOfWeek.reduce(
          (acc, day) => ({
            ...acc,
            [day]: { morning: [], evening: [], fullDay: [] },
          }),
          {}
        );

        entries.forEach(({ day, shift, startTime, endTime, doctor }) => {
          if (!grouped[day]) return;
          const key = shift === "Full Day" ? "fullDay" : shift.toLowerCase();
          grouped[day][key].push(`${doctor.name} (${startTime} - ${endTime})`);
        });

        setRosters(grouped);

        const today = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][new Date().getDay()];
        if (grouped[today]) setSelectedDay(today);
      } catch (err) {
        console.error("Failed to load roster:", err);
      }
    };

    fetchRoster();
  }, []);

  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-8">
        Doctors Duty Roster (Weekly View)
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-white rounded-xl shadow hover:shadow-lg p-5 cursor-pointer transition"
            onClick={() => setSelectedDay(day)}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[#0e7660] mb-2">
              {day}
            </h3>
            {rosters[day].morning.length > 0 && (
              <p className="text-gray-700 text-sm sm:text-base">
                Morning: {rosters[day].morning.length} Doctors
              </p>
            )}
            {rosters[day].evening.length > 0 && (
              <p className="text-gray-700 text-sm sm:text-base">
                Evening: {rosters[day].evening.length} Doctors
              </p>
            )}
            {rosters[day].fullDay.length > 0 && (
              <p className="text-gray-700 text-sm sm:text-base">
                Full Day: {rosters[day].fullDay.length} Doctors
              </p>
            )}
          </div>
        ))}
      </div>

      {selectedDay && (
        <Modal
          day={selectedDay}
          roster={rosters[selectedDay]}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default DutyRosterOfDoctorsPage;
