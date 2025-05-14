import React from "react";

const DoctorInfo = ({ doctor }) => {
  return (
    <div>
      {" "}
      <h3 className="font-semibold">Doctor</h3>
      <p>
        {doctor.name} (ID: {doctor.uniqueId})
      </p>
      <p>Date: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default DoctorInfo;
