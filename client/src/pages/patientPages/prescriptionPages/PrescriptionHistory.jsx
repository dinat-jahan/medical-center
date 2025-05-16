import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import PrescriptionCard from "./component/PrescriptionCard";
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
    <div className="w-full min-h-screen px-8 sm:px-16 md:px-24 lg:px-32 xl:px-48 py-10">
      <div className="border border-gray-400 shadow-lg rounded-xl p-10 bg-white">
        {/* Title */}
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Your Prescriptions
        </h2>

        {/* Cards */}
        <div className="flex flex-col items-center gap-6">
          {prescriptions.map((p) => (
            <PrescriptionCard key={p._id} prescription={p} />
          ))}
          {prescriptions.length === 0 && (
            <p className="text-center text-gray-600">No prescriptions found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHistory;
