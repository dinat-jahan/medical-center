import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PrescriptionCard from "../../components/PrescriptionCard";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

const DoctorPrescriptionHistory = () => {
  const { user: doctor } = useContext(UserContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPrescriptions = async () => {
      try {
        const { data } = await axios.get(
          `/doctor/my-prescriptions/${doctor.id}`
        );
        if (data.success) {
          setPrescriptions(data.prescriptions);
        }
      } catch (err) {
        console.error("Error loading prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPrescriptions();
  }, []);

  if (loading) return <div>Loading your prescriptions…</div>;

  return (
    <div className="w-full min-h-screen bg-teal-50 px-8 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          My Suggested Prescriptions
        </h2>
        {prescriptions.length > 0 ? (
          <div className="space-y-6 flex flex-col items-center">
            {prescriptions.map((p) => (
              <PrescriptionCard key={p._id} prescription={p} showPatientLink />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            You have not written any prescriptions yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptionHistory;
