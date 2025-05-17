import axios from "axios";
import React from "react";
import { useState } from "react";

const DispenseDetail = ({ record, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  async function toggleRequest() {
    const nextStatus =
      record.overallStatus === "pending" ? "completed" : "pending";
    try {
      await axios.patch(`/medical-staff/dispense-records/${record._id}`, {
        overallStatus: nextStatus,
      });

      if (nextStatus === "completed") {
        await axios.post(
          `/medical-staff/dispenses-records/${record._id}/finalize`
        );
      }
      onUpdate();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between ">
      {/* Top: title and status badge */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Request Details</h2>
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
            record.overallStatus === "completed"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {record.overallStatus.toUpperCase()}
        </span>
      </div>

      {/* Medicine List */}
      <ul className="flex-1 divide-y divide-gray-100">
        {record.medicines.map((item) => (
          <li key={item._id} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-medium text-lg">{item.medicine.name}</div>
              <div className="text-sm text-gray-500">
                {item.medicine.dosage || "No dose info"}
              </div>
            </div>
            <span className="text-xl font-bold text-indigo-700">
              × {item.quantity}
            </span>
          </li>
        ))}
      </ul>

      {/* Bottom: action button */}
      <div className="mt-6 text-right">
        <button
          disabled={loading}
          onClick={toggleRequest}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            record.overallStatus === "pending"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading
            ? "..."
            : record.overallStatus === "pending"
            ? "Mark Completed"
            : "Revert Pending"}
        </button>
      </div>
    </div>
  );
};

export default DispenseDetail;
