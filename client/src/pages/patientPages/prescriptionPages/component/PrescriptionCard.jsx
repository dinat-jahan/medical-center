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
    <div onClick={() => navigate(`/show-prescription/${_id}`)}>
      <div>
        <p>{formattedDate}</p>
        <p>Rx # {prescriptionNumber}</p>
        <p>{doctor.name}</p>
        {diagnoses.length > 0 && (
          <p>{diagnoses.map((d) => d.displayName).join(",")}</p>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/show-prescription/${_id}`);
        }}
      >
        View
      </button>
    </div>
  );
};

export default PrescriptionCard;
