import React from "react";
import { useNavigate } from "react-router-dom";

const PrescriptionCard = ({ prescription }) => {
  const navigate = useNavigate();
  const {
    _id,
    date,
    prescriptionNumber,
    doctor,
    diagnoses = [],
  } = prescription;

  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <div
      onClick={() => navigate(`/show-prescription/${_id}`)}
      className="border border-gray-800 shadow-md rounded-3xl p-4  cursor-pointer w-[600px]"
    >
      <p className="text-gray-700 mb-1 px-2 ">{formattedDate}</p>
      <p className="text-gray-800 font-medium mb-1 px-2">
        {prescriptionNumber}
      </p>
      <p className="text-gray-700 mb-1 px-2">{doctor?.name}</p>
      {diagnoses.length > 0 && (
        <p className="text-gray-600 mb-4 px-2">
          {diagnoses.map((d) => d.displayName).join(", ")}
        </p>
      )}
      <div className="flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent box click from navigating
            navigate(`/show-prescription/${_id}`);
          }}
          className="bg-teal-500 text-white font-semibold py-2 w-[200px] rounded-2xl hover:bg-teal-700 border-none"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default PrescriptionCard;
