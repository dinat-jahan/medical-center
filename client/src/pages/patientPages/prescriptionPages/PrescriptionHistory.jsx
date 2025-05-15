import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionCard from "./component/PrescriptionCard";
import { useContext } from "react";
import { UserContext } from "../../../UserContext";
const PrescriptionHistory = () => {
  const { user: patient } = useContext(UserContext);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await axios.get(
          `/patient/prescription-history/${patient.id}`
        );
        setPrescriptions(data.prescriptions);
      } catch (err) {
        console.log(err);
      }
    };
    loadHistory();
  }, []);

  return (
    <div>
      <h2>Your Prescriptions</h2>
      {prescriptions.map((p) => (
        <PrescriptionCard key={p._id} prescription={p} />
      ))}
      {prescriptions.length === 0 && <p>No prescriptions found</p>}
    </div>
  );
};

export default PrescriptionHistory;
