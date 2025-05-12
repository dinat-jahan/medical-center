import React from "react";

const PatientInfoCard = ({ patient }) => {
  return (
    <div>
      <p>
        <strong>ID:</strong> {patient.uniqueId}
      </p>
      <p>
        <strong>Name:</strong> {patient.name}
      </p>
    </div>
  );
};

export default PatientInfoCard;
