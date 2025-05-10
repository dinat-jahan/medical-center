import { useState, useEffect } from "react";

import axios from "axios";

const AddNewDutyForm = ({ doctors }) => {
  // console.log("doctors", doctors);
  const [formData, setFormData] = useState({
    doctor: "",
    day: "Saturday",
    shift: "Morning",
    startTime: "",
    endTime: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios
      .post("/admin/medical/duty-roster-doctor/add", formData)
      .then(() => {
        setSuccessMessage("Duty Added Successfully");
        setErrorMessage("");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Error adding duty");
        setSuccessMessage("");
      });
  };

  useEffect(() => {
    handleShiftChange({ target: { value: formData.shift } });
  }, []);
  // Handle shift change and update time
  const handleShiftChange = (e) => {
    const newShift = e.target.value;
    let newStartTime = "";
    let newEndTime = "";

    if (newShift === "Morning") {
      newStartTime = "8:00 am";
      newEndTime = "2:00 pm";
    } else if (newShift === "Evening") {
      newStartTime = "2:00 pm";
      newEndTime = "8:00 pm";
    } else if (newShift === "Full Day") {
      newStartTime = "9:00 am";
      newEndTime = "5:00 pm";
    }

    setFormData({
      ...formData,
      shift: newShift,
      startTime: newStartTime,
      endTime: newEndTime,
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Doctor:</label>
          <select
            name="doctor"
            id="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select doctor</option>
            {doctors && doctors.length > 0 ? (
              doctors.map((doctor) => {
                return (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                );
              })
            ) : (
              <option disabled>No doctors available</option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="">Day:</label>
          <select
            name="day"
            id="day"
            value={formData.day}
            onChange={handleChange}
            required
          >
            {[
              "Saturday",
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Shift:</label>
          <select
            name="shift"
            value={formData.shift}
            onChange={handleShiftChange}
            required
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Full Day">Full Day</option>
          </select>
        </div>
        {/* <div>
          <label htmlFor="startTime" style={{ fontSize: "18px" }}>
            Start Time:
          </label>
          <input
            type="text"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div> */}

        {/* <div>
          <label htmlFor="endTime" style={{ fontSize: "18px" }}>
            End Time:
          </label>
          <input
            type="text"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div> */}
        <div>
          <label>Start Time:</label>
          <input
            type="text"
            name="startTime"
            value={formData.startTime}
            readOnly
            disabled
          />
        </div>

        {/* Automatically populated endTime based on shift */}
        <div>
          <label>End Time:</label>
          <input
            type="text"
            name="endTime"
            value={formData.endTime}
            readOnly
            disabled
          />
        </div>
        <button>Add Duty</button>
      </form>
      {successMessage && (
        <div style={{ color: "green", marginTop: "10px" }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default AddNewDutyForm;
