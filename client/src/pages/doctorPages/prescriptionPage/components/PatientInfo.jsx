import React from "react";

const PatientInfo = ({ patient }) => {
  if (!patient) {
    // either a spinner or placeholder
    return <div className="text-center py-20">Loading patient info…</div>;
  }
  return (
    <div>
      <h3>Patient</h3>
      <p>Patient name: </p>
      <span>{patient.name}</span>
      <p>Patient uniqueId: </p>
      <span>{patient.uniqueId}</span>
      <p>Age: </p>
      <span>{patient.age}</span>
      <p>Sex: </p>
      <span>{patient.sex}</span>
    </div>
  );
};

export default PatientInfo;
