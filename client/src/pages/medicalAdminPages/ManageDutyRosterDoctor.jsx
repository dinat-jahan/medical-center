import React, { useEffect, useState } from "react";
import AddNewDutyForm from "../../components/AddNewDutyForm";
import axios from "axios";
import DutyRosterOfDoctorsPage from "../DutyRosterofDoctorsPage";
const ManageDutyRosterDoctor = () => {
  const [dutyRosterDoctors, setDutyRosterDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/admin/medical/duty-roster-doctor");
        setDutyRosterDoctors(data.dutyRosterDoctor || []);
        setDoctors(data.doctors || []);
        console.log("doctor in first code", doctors);
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
  return (
    <div>
      <h2>Duty Roster of Doctors</h2>
      <table>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Day</th>
            <th>Shift</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dutyRosterDoctors && dutyRosterDoctors.length > 0 ? (
            dutyRosterDoctors.map((e) => {
              return (
                <tr key={e._id}>
                  <td>{e.doctor.name}</td>
                  <td>{e.day}</td>
                  <td>{e.shift}</td>
                  <td>
                    {e.startTime} - {e.endTime}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(e._id)}>Delete</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No duty roster found</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Add new Duty</h3>
      <AddNewDutyForm doctors={doctors} />
    </div>
  );
};

export default ManageDutyRosterDoctor;
