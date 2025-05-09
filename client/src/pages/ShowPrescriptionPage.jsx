import React from "react";

const ShowPrescriptionPage = () => {
  // Sample Patient Data
  const patient = {
    name: "Jane Doe",
    sex: "Female",
    age: 29,
  };

  // Sample Prescription Data
  const prescription = {
    diagnosis: "Upper Respiratory Infection",
    followUpDate: "2025-05-15",
    advice: "Take plenty of fluids and rest.",
    medicines: [
      {
        drugName: "Paracetamol",
        dose: "500mg",
        frequency: "3 times a day",
        startDate: "2025-05-07",
        duration: "5 days",
        totalQuantity: "15 tablets",
        comments: "Take after meals",
        dispensedFrom: "internal",
      },
      {
        drugName: "Azithromycin",
        dose: "250mg",
        frequency: "Once daily",
        startDate: "2025-05-07",
        duration: "3 days",
        totalQuantity: "3 tablets",
        comments: "",
        dispensedFrom: "external",
      },
    ],
  };

  // Defensive checks
  const visitDate = new Date().toDateString();
  const followUpDate = prescription?.followUpDate
    ? new Date(prescription.followUpDate).toDateString()
    : "N/A";

  const internalMeds = prescription?.medicines?.filter(
    (med) => med.dispensedFrom === "internal"
  ) || [];

  const externalMeds = prescription?.medicines?.filter(
    (med) => med.dispensedFrom === "external"
  ) || [];

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 border">
        <h1 className="text-3xl font-poetsen text-center text-teal-400 mb-6">
          Prescription
        </h1>

        <div className="space-y-2 mb-6">
          <p>
            <strong>Name:</strong> {patient?.name || "N/A"}
          </p>
          <p>
            <strong>Sex:</strong> {patient?.sex || "N/A"}
          </p>
          <p>
            <strong>Age:</strong> {patient?.age ? `${patient.age} years` : "N/A"}
          </p>
          <p>
            <strong>Visit Date:</strong> {visitDate}
          </p>
          <p>
            <strong>Diagnosis:</strong> {prescription?.diagnosis || "N/A"}
          </p>
        </div>

        {internalMeds.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-teal-700 mb-2">
              Medicines to be collected from Medical Center Pharmacy:
            </h3>
            <MedicineTable medicines={internalMeds} />
          </div>
        )}

        {externalMeds.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Medicines to be collected from External Pharmacy:
            </h3>
            <MedicineTable medicines={externalMeds} />
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-bold text-sky-500">Follow-up Date:</h3>
          <p>{followUpDate}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-teal-400">Advice:</h3>
          <p>{prescription?.advice || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

const MedicineTable = ({ medicines }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">Drug Name</th>
          <th className="border px-2 py-1">Dose</th>
          <th className="border px-2 py-1">Frequency</th>
          <th className="border px-2 py-1">Start Date</th>
          <th className="border px-2 py-1">Duration</th>
          <th className="border px-2 py-1">Total Quantity</th>
          <th className="border px-2 py-1">Comments</th>
        </tr>
      </thead>
      <tbody>
        {medicines.map((med, index) => (
          <tr key={index}>
            <td className="border px-2 py-1">{med.drugName}</td>
            <td className="border px-2 py-1">{med.dose}</td>
            <td className="border px-2 py-1">{med.frequency}</td>
            <td className="border px-2 py-1">
              {new Date(med.startDate).toDateString()}
            </td>
            <td className="border px-2 py-1">{med.duration}</td>
            <td className="border px-2 py-1">{med.totalQuantity}</td>
            <td className="border px-2 py-1">{med.comments || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ShowPrescriptionPage;
