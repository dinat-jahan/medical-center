// TimeSlotTable.jsx
import React from "react";

const TimeSlotTable = ({
  slots,
  user,
  isDoctor,
  isStaff,
  isAdmin,
  isPatient,
  handleBooking,
  handleCancel,
  handleMakeUnavailable,
  onPatientClick,
  handleMarkAsSeen,
}) => (
  <table className="w-full border-collapse border">
    <thead>
      <tr className="bg-gray-200 text-center">
        <th className="p-2 border">Queue No.</th>
        <th className="p-2 border">Patient ID</th>
        <th className="p-2 border">Patient Name</th>
        <th className="p-2 border">Time</th>
        <th className="p-2 border">Status</th>
        <th className="p-2 border">Booking Status</th>
        {isPatient && <th className="p-2 border">Action</th>}
        {isAdmin && <th className="p-2 border">Admin</th>}
      </tr>
    </thead>
    <tbody>
      {slots.map((slot) => {
        const bookerId = slot.bookedBy?.id;
        const isBookedByUser = bookerId === user.id;
        const showInfo = isDoctor || isStaff || isAdmin || isBookedByUser;
        return (
          <tr key={slot._id} className="text-center">
            <td className="border p-2">{slot.queueNumber}</td>
            <td className="border p-2">
              {showInfo && slot.bookedBy ? (
                isDoctor ? (
                  <button
                    onClick={() => onPatientClick(slot)}
                    className="text-gray-900 underline bg-none cursor-pointer"
                    type="button"
                  >
                    {slot.bookedBy.uniqueId}
                  </button>
                ) : (
                  slot.bookedBy.uniqueId
                )
              ) : (
                "-"
              )}
            </td>
            <td className="border p-2">
              {showInfo && slot.bookedBy ? (
                isDoctor ? (
                  <button
                    onClick={() => onPatientClick(slot)}
                    className="text-gray-900 underline cursor-pointer bg-none"
                    type="button"
                  >
                    {slot.bookedBy.name}
                  </button>
                ) : (
                  slot.bookedBy.name
                )
              ) : (
                "-"
              )}
            </td>
            <td className="border p-2">{slot.time}</td>
            <td className="border p-2">{slot.status}</td>
            <td className="border p-2">{slot.bookingStatus}</td>

            {isPatient && (
              <td className="border p-2">
                {isBookedByUser && slot.bookingStatus === "booked" ? (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleCancel(slot._id)}
                  >
                    ❌
                  </button>
                ) : slot.status === "available" && slot.bookingStatus === "" ? (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleBooking(slot._id)}
                  >
                    ✔
                  </button>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            )}
            {isAdmin && (
              <td className="border p-2">
                {slot.status === "available" ? (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => handleMakeUnavailable(slot._id)}
                  >
                    Unavailable
                  </button>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default TimeSlotTable;
