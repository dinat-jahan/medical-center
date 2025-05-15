import { useState, useEffect } from "react";
import axios from "axios";

const AddNewDutyForm = ({ doctors, onAddDuty }) => {
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
    axios
      .post("/admin/medical/duty-roster-doctor/add", formData)
      .then((res) => {
        const createdDuty = res.data;
        onAddDuty(createdDuty);
        setSuccessMessage("Duty Added Successfully");
        setErrorMessage("");
      })
      .catch((err) => {
        setErrorMessage(err.response?.data?.error || "Something went wrong");
        setSuccessMessage("");
      });
  };

  useEffect(() => {
    handleShiftChange({ target: { value: formData.shift } });
  }, []);

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
    <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 text-sm text-gray-800"
      >
        {/* Doctor Select */}
        <div>
          <label className="block mb-1 font-semibold">Doctor:</label>
          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-400"
          >
            <option value="">Select doctor</option>
            {doctors && doctors.length > 0 ? (
              doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))
            ) : (
              <option disabled>No doctors available</option>
            )}
          </select>
        </div>

        {/* Day and Shift - side by side */}
        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Day:</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              required
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-400"
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

          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Shift:</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleShiftChange}
              required
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>
        </div>

        {/* Start Time and End Time - side by side */}
        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Start Time:</label>
            <input
              type="text"
              name="startTime"
              value={formData.startTime}
              readOnly
              disabled
              className="w-full px-3 py-1.5 bg-gray-100 border border-gray-200 rounded"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">End Time:</label>
            <input
              type="text"
              name="endTime"
              value={formData.endTime}
              readOnly
              disabled
              className="w-full px-3 py-1.5 bg-gray-100 border border-gray-200 rounded"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-2 bg-teal-500 hover:bg-teal-700 text-white py-1.5 px-6 rounded-full shadow-sm mx-auto border-none w-[300px]"
        >
          Add Duty
        </button>
      </form>

      {/* Messages */}
      {successMessage && (
        <div className="text-green-600 mt-2 text-center text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="text-red-600 mt-2 text-center text-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default AddNewDutyForm;
