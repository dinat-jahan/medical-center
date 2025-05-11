import React, { useState } from "react";
import { Phone, ChevronDown } from "lucide-react"; // Importing icons

const telemedicineRoster = {
  Saturday: { name: "Dr. Nipa Debnath", phone: "01739-292669" },
  Sunday: { name: "Dr. Harun Or Rashid Rasel", phone: "01735-156656" },
  Monday: { name: "Dr. Ahammod Hossain Siddique", phone: "01706-967435" },
  Tuesday: { name: "Dr. Kawser Ahmed", phone: "01753-151133" },
  Wednesday: { name: "Dr. Nur Md. Kawsar Abid", phone: "01953-339202" },
  Thursday: { name: "Dr. Nur Md. Kawsar Abid", phone: "01953-339202" },
  Friday: { name: "Dr. Nur Md. Kawsar Abid", phone: "01953-339202" },
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

  const handleToggle = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="min-h-screen bg-teal-50 py-10 px-4">
      <h2 className="text-3xl font-poetsen text-center text-teal-500 mb-8">
        Telemedicine Duty Schedule
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {daysOfWeek.map((day) => {
          const isExpanded = expandedDay === day;
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
                  <h3 className="text-xl font-semibold text-[#0e7660]">{day}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isExpanded && (
                <div className="mt-4 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Doctor:</span> {telemedicineRoster[day].name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {telemedicineRoster[day].phone}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TelemedicinePage;
