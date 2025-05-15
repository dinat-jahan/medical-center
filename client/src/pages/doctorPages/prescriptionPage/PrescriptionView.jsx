import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PrescriptionView() {
  const { prescriptionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [dispenseRecord, setDispenseRecord] = useState(
    location.state?.dispenseRecord || null
  );
  const [showDispense, setShowDispense] = useState(false);

  useEffect(() => {
    async function fetchPrescription() {
      try {
        const { data } = await axios.get(
          `/doctor/show-prescription/${prescriptionId}`
        );
        setPrescription(data.prescription);
        setDispenseRecord(data.dispenseRecord);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPrescription();
  }, [prescriptionId]);

  if (!prescription) return <div>Loading prescription…</div>;

  const internalMeds = prescription.medicines.filter(
    (m) => m.dispensedFrom === "internal"
  );
  const externalMeds = prescription.medicines.filter(
    (m) => m.dispensedFrom === "external"
  );
  const logoUrl = "/university-logo.png"; // Replace with your actual logo path

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg relative">
      {/* Print Button */}
      <button
        onClick={() => window.print()}
        className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-md hover:bg-indigo-700 print:hidden"
      >
        Print
      </button>

      {/* Header Row: Date, Rx #, Logo */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-500 text-sm">
          {new Date(prescription.date).toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 text-sm">
            Rx # {prescription.prescriptionNumber}
          </span>
          <img src={logoUrl} alt="University Logo" className="h-8 w-auto" />
        </div>
      </div>

      {/* Patient & Doctor Info */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="font-semibold mb-2 text-lg">Patient</h4>
          <p className="text-sm">
            <span className="font-medium">Name:</span>{" "}
            {prescription.patient.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">ID:</span>{" "}
            {prescription.patient.uniqueId}
          </p>
          <p className="text-sm">
            <span className="font-medium">Sex:</span> {prescription.patient.sex}
          </p>
          <p className="text-sm">
            <span className="font-medium">Age:</span> {prescription.age}
          </p>
        </div>
        <div className="text-right">
          <h4 className="font-semibold mb-2 text-lg">Doctor</h4>
          <p className="text-sm font-medium">{prescription.doctor.name}</p>
          <p className="text-sm">ID: {prescription.doctor.uniqueId}</p>
          <div className="mt-6 border-t border-gray-300"></div>
          <p className="text-sm text-gray-500 mt-1">Signature</p>
        </div>
      </section>

      {/* Diagnoses (Optional) */}
      {prescription.diagnoses.length > 0 && (
        <section className="mb-6">
          <h4 className="font-semibold mb-2 text-lg">Diagnoses</h4>
          <p className="text-sm">
            {prescription.diagnoses
              .map((d) => d.displayName ?? d.name)
              .join(", ")}
          </p>
        </section>
      )}

      {/* Medicines Section */}
      <section className="mb-6">
        {/* Internal Pharmacy */}
        {internalMeds.length > 0 && (
          <>
            <h4 className="font-semibold mb-2 text-indigo-600">
              Medicine dispensed from Medical Centre Pharmacy
            </h4>
            {internalMeds.map((m, i) => (
              <div key={i} className="border rounded p-4 mb-3">
                <div className="flex justify-between">
                  <span className="font-medium">{m.medicineName}</span>
                  <span className="text-sm text-gray-600">{m.dose}</span>
                </div>
                <div className="flex space-x-4 text-sm text-gray-700 mt-1">
                  <span>Frequency: {m.frequency}</span>
                  <span>Duration: {m.duration}</span>
                </div>
                {m.comments && (
                  <p className="mt-2 text-sm italic text-gray-600">
                    {m.comments}
                  </p>
                )}
              </div>
            ))}
          </>
        )}

        {/* External Pharmacy */}
        {externalMeds.length > 0 && (
          <>
            <h4 className="font-semibold mb-2 text-green-600">
              Medicine dispensed from External Pharmacy
            </h4>
            {externalMeds.map((m, i) => (
              <div key={i} className="border rounded p-4 mb-3">
                <div className="flex justify-between">
                  <span className="font-medium">{m.medicineName}</span>
                  <span className="text-sm text-gray-600">{m.dose}</span>
                </div>
                <div className="flex space-x-4 text-sm text-gray-700 mt-1">
                  <span>Frequency: {m.frequency}</span>
                  <span>Duration: {m.duration}</span>
                </div>
                {m.comments && (
                  <p className="mt-2 text-sm italic text-gray-600">
                    {m.comments}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </section>

      {/* Tests (Optional) */}
      {prescription.tests && prescription.tests.length > 0 && (
        <section className="mb-6">
          <h4 className="font-semibold mb-2 text-lg">Recommended Tests</h4>
          <ul className="list-disc list-inside text-sm">
            {prescription.tests.map((t, i) => (
              <li key={i}>{t.name}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Advice & Follow-Up */}
      {prescription.advice && (
        <section className="mb-6">
          <h4 className="font-semibold mb-2 text-lg">Advice</h4>
          <p className="text-sm">{prescription.advice}</p>
        </section>
      )}
      {prescription.followUpDate && (
        <section className="mb-6">
          <h4 className="font-semibold mb-2 text-lg">Follow-Up Date</h4>
          <p className="text-sm">
            {new Date(prescription.followUpDate).toLocaleDateString()}
          </p>
        </section>
      )}

      {/* Dispense Record (Collapsible) */}
      {dispenseRecord && (
        <section className="mb-6">
          <button
            onClick={() => setShowDispense(!showDispense)}
            className="text-blue-600 hover:underline mb-4 text-sm"
          >
            {showDispense ? "Hide" : "Show"} Dispense Record
          </button>
          {showDispense && (
            <div className="bg-gray-50 p-4 rounded">
              <ul className="list-disc list-inside text-sm">
                {dispenseRecord.medicines.map((d, i) => (
                  <li key={i}>
                    {d.medicineName || d.medicine?.name}: {d.quantity} (
                    {d.status})
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">
                Status: {dispenseRecord.overallStatus}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
