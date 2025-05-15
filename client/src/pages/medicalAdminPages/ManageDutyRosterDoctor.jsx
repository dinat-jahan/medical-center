import React, { useEffect, useState } from "react";
import AddNewDutyForm from "../../components/AddNewDutyForm";
import axios from "axios";

const ManageDutyRosterDoctor = () => {
  const [dutyRosterDoctors, setDutyRosterDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Saturday"); // default day

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/admin/medical/duty-roster-doctor");
        setDutyRosterDoctors(data.dutyRosterDoctor || []);
        setDoctors(data.doctors || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    axios
      .post(`/admin/medical/duty-roster-doctor/delete/${id}`)
      .then(() => {
        setDutyRosterDoctors((prev) =>
          prev.filter((doctor) => doctor._id !== id)
        );
      })
      .catch((err) => console.log(err));
  };

  const handleAddDuty = (newDuty) => {
    setDutyRosterDoctors((prev) => [...prev, newDuty]);
  };

  // Filter data by selected day
  const filteredRoster = dutyRosterDoctors.filter((item) => item.day === selectedDay);

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Add New Duty */}
          <div>
            <h2 className="text-3xl font-poetsen mb-6 text-center text-teal-700 pb-4">
              Add New Duty
            </h2>
            <div className="w-full bg-teal-100 p-6 shadow-lg rounded-3xl">
              <AddNewDutyForm doctors={doctors} onAddDuty={handleAddDuty} />
            </div>
          </div>

          {/* Right Column - Duty Roster Table */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-poetsen mb-6 text-center text-teal-700 pb-2">
                 Duty Roster of Doctors
              </h2>
              {/* Day Filter Dropdown */}
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="px-4 py-2 border rounded-2xl shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div className="overflow-x-auto shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-teal-100">
                  <tr className="text-left text-gray-800 font-semibold">
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Day</th>
                    <th className="px-4 py-3">Shift</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRoster.length > 0 ? (
                    filteredRoster.map((e) => (
                      <tr key={e._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          {e.doctor?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm">{e.day}</td>
                        <td className="px-4 py-3 text-sm">{e.shift}</td>
                        <td className="px-4 py-3 text-sm">
                          {e.startTime} - {e.endTime}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(e._id)}
                            className="bg-teal-500 hover:bg-teal-700 text-white px-3 py-1 text-sm rounded-3xl w-40 border-none"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center text-blue-700 py-6 font-semibold"
                      >
                        No duty roster found for {selectedDay}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDutyRosterDoctor;
