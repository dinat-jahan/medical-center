// src/pages/doctor/DoctorPatientHistory.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PrescriptionCard from "../../components/PrescriptionCard";

const DoctorPatientHistory = () => {
  const { uniqueId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`/doctor/patient-history/${uniqueId}`);
        console.log(data);
        if (data.success) setHistory(data.prescriptions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (uniqueId) fetchHistory();
  }, [uniqueId]);

  if (loading) return <div>Loading history…</div>;

  return (
    <div className="w-full min-h-screen px-8 py-10 bg-teal-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-6 text-teal-700">
          Patient Medical History
        </h2>
        {history.length > 0 ? (
          <div className="space-y-6 flex flex-col items-center">
            {history.map((presc) => (
              <PrescriptionCard
                key={presc._id}
                prescription={presc}
                // optionally pass a flag to style differently for doctors
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No previous prescriptions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientHistory;
