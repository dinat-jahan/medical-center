import React, { useEffect } from "react";

const TimeSlotTable = ({ slots, patient, handleBooking, handleCancel }) => {
  return (
    <div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Queue Number</th>
            <th className="p-2 border">Patient Id</th>
            <th className="p-2 border">Patient Name</th>

            <th className="p-2 border">Time</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Booking Status</th>
            <th className="p-2 border">Book/Cancel</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{slot.queueNumber}</td>
              <td className="border p-2">
                {slot.bookedBy === patient.id ? patient.uniqueId : ""}
              </td>
              <td className="border p-2">
                {slot.bookedBy === patient.id ? patient.name : ""}
              </td>
              <td className="border p-2">{slot.time}</td>
              <td className="border p-2">{slot.status || "available"}</td>
              <td className="border p-2">{slot.bookingStatus || ""}</td>
              <td className="border p-2">
                {/* If the slot is available and not booked, show the green tick */}
                {slot.bookingStatus === "" && slot.status === "available" ? (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleBooking(slot._id)} // Handle booking
                  >
                    ✔ {/* Green tick */}
                  </button>
                ) : slot.bookingStatus === "booked" &&
                  slot.status === "available" &&
                  slot.bookedBy === patient.id ? (
                  // If the slot is booked by the logged-in user, show the red cross to cancel
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleCancel(slot._id)} // Handle cancellation
                  >
                    ❌ {/* Red cross */}
                  </button>
                ) : (
                  // If neither of the above, no button (empty space)
                  <span className="text-gray-500"></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeSlotTable;
