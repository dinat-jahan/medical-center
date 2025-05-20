import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Phone, ChevronDown } from "lucide-react";

// Modal component with click-outside-to-close
const Modal = ({ day, doctor, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-teal-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-lg"
          aria-label="Close modal"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-teal-600">
          {day} - Doctor Info
        </h3>
        {doctor ? (
          <div className="text-gray-700 text-base">
            <p>
              <span className="font-semibold">Doctor:</span> {doctor.name}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {doctor.phone}
            </p>
          </div>
        ) : (
          <p className="italic text-gray-500">
            No doctor assigned for this day.
          </p>
        )}
      </div>
    </div>
  );
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

const TelemedicinePage = () => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showModalOnLoad, setShowModalOnLoad] = useState(false);
  const [roster, setRoster] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate today with mapping (Saturday start)
  function getToday() {
    const dayMap = [1, 2, 3, 4, 5, 6, 0];
    const todayIndex = new Date().getDay();
    const mappedIndex = dayMap[todayIndex];
    return daysOfWeek[mappedIndex];
  }

  useEffect(() => {
    async function fetchRoster() {
      try {
        setLoading(true);
        const res = await axios.get("/api/telemedicine-duty");
        const duties = res.data.duties || [];

        const map = {};
        duties.forEach(({ day, doctor }) => {
          map[day] = doctor;
        });
        setRoster(map);

        setShowModalOnLoad(true); // show modal on first load
        setExpandedDay(null); // no inline expanded card on load
        setError(null);
      } catch (e) {
        setError("Failed to load telemedicine roster.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRoster();
  }, []);

  // Modal closes here
  const closeModal = () => setShowModalOnLoad(false);

  // On card click: toggle inline expand, close modal if open
  const handleToggle = (day) => {
    if (showModalOnLoad) setShowModalOnLoad(false);
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-teal-600">
        Loading telemedicine duty schedule...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );
  }

  const today = getToday();

  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <h2 className="text-3xl font-poetsen text-center text-teal-500 mb-8">
        Telemedicine Duty Schedule
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {daysOfWeek.map((day) => {
          const isExpanded = expandedDay === day;
          const doctor = roster[day];

          return (
            <div
              key={day}
              onClick={() => handleToggle(day)}
              className={`bg-teal-50 border border-gray-300 rounded-xl shadow cursor-pointer transition-all duration-300 overflow-hidden ${
                isExpanded ? "p-6 h-auto" : "p-4 h-28"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#0e7660]" />
                  <h3 className="text-xl font-semibold text-[#0e7660]">
                    {day}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isExpanded && (
                <div className="mt-4 text-sm text-gray-700">
                  {doctor ? (
                    <>
                      <p>
                        <span className="font-medium">Doctor:</span>{" "}
                        {doctor.name}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {doctor.phone}
                      </p>
                    </>
                  ) : (
                    <p className="italic text-gray-500">
                      No doctor assigned for this day.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show modal only once on page load for current day */}
      {showModalOnLoad && roster[today] && (
        <Modal day={today} doctor={roster[today]} onClose={closeModal} />
      )}
    </div>
  );
};

export default TelemedicinePage;
