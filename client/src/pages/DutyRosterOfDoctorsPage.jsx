import React from "react";

const DutyRosterOfDoctorsPage = () => {
  // Dummy data doctor duty schedule er jonne
  const dutyRoster = [
    {
      _id: "1",
      doctor: { name: "Dr. Salma Akter" },
      day: "Sunday",
      shift: "Morning",
      startTime: "08:00 AM",
      endTime: "02:00 PM",
    },
    {
      _id: "2",
      doctor: { name: "Dr. Mahmud Hasan" },
      day: "Monday",
      shift: "Evening",
      startTime: "02:00 PM",
      endTime: "08:00 PM",
    },
    {
      _id: "3",
      doctor: { name: "Dr. Fatema Begum" },
      day: "Wednesday",
      shift: "Morning",
      startTime: "09:00 AM",
      endTime: "03:00 PM",
    },
  ];

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctors' Duty Roster</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">Doctor Name</th>
              <th className="p-3">Day</th>
              <th className="p-3">Shift</th>
              <th className="p-3">Start Time</th>
              <th className="p-3">End Time</th>
            </tr>
          </thead>
          <tbody>
            {dutyRoster.map((entry) => (
              <tr key={entry._id} className="hover:bg-gray-100 border-b">
                <td className="p-3">{entry.doctor.name}</td>
                <td className="p-3">{entry.day}</td>
                <td className="p-3">{entry.shift}</td>
                <td className="p-3">{entry.startTime}</td>
                <td className="p-3">{entry.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DutyRosterOfDoctorsPage;
