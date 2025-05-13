import React, { useEffect, useState } from "react";
import AddNewDutyForm from "../../components/AddNewDutyForm";
import axios from "axios";

const ManageDutyRosterDoctor = () => {
  const [dutyRosterDoctors, setDutyRosterDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);

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

  return (
    <div className="bg-teal-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-20">
        <h3 className="text-2xl font-poetsen mb-4 text-teal-500 text-center">
          Add New Duty
        </h3>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-xl bg-teal-50 p-6 shadow-lg rounded-3xl">
            <AddNewDutyForm doctors={doctors} onAddDuty={handleAddDuty} />
          </div>
        </div>
        <h2 className="text-3xl font-poetsen mb-6 text-center text-teal-700 pb-4">
          Duty Roster of Doctors
        </h2>

        <div className="overflow-x-auto shadow rounded-lg mb-10">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-teal-100">
              <tr className="px-4 py-3 text-left text-bold font-bold text-gray-800">
                <th>Doctor </th>
                <th> Day</th>
                <th>Shift</th>
                <th> Time </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dutyRosterDoctors && dutyRosterDoctors.length > 0 ? (
                dutyRosterDoctors.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{e.doctor.name}</td>
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
                    No duty roster found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDutyRosterDoctor;
