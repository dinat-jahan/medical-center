import React, { useState } from 'react';

const WritePrescription = () => {
  // Sample Patient Data
  const patient = {
    _id: '12345',
    name: 'John Doe',
    sex: 'Male',
    age: 35,
  };

  // State for Medicines
  const [medicines, setMedicines] = useState([
    {
      drugName: '',
      dose: '',
      frequency: '',
      startDate: '',
      duration: '',
      totalQuantity: '',
      comments: '',
      dispensedFrom: '',
    },
  ]);

  // Add new medicine row
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        drugName: '',
        dose: '',
        frequency: '',
        startDate: '',
        duration: '',
        totalQuantity: '',
        comments: '',
        dispensedFrom: '',
      },
    ]);
  };

  // Handle form submission (just logs data for now)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted medicines:', medicines);
    alert('Prescription submitted! Check the console.');
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-3xl font-poetsen text-center text-teal-5cd00 mb-4">
        Write Prescription
      </h2>

      <div className="space-y-2 mb-6 text-gray-700">
        <p><strong>Patient Name:</strong> {patient?.name || 'N/A'}</p>
        <p><strong>Sex:</strong> {patient?.sex || 'N/A'}</p>
        <p><strong>Age:</strong> {patient?.age ? `${patient.age} years` : 'N/A'}</p>
        <p><strong>Visit Date:</strong> {new Date().toDateString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Medicine Inputs */}
        {medicines.map((med, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Drug Name"
              className="border px-3 py-2 rounded w-full"
              value={med.drugName}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].drugName = e.target.value;
                setMedicines(updated);
              }}
              required
            />
            <input
              type="text"
              placeholder="Dose"
              className="border px-3 py-2 rounded w-full"
              value={med.dose}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].dose = e.target.value;
                setMedicines(updated);
              }}
              required
            />
            <input
              type="text"
              placeholder="Frequency"
              className="border px-3 py-2 rounded w-full"
              value={med.frequency}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].frequency = e.target.value;
                setMedicines(updated);
              }}
            />
            <input
              type="date"
              placeholder="Start Date"
              className="border px-3 py-2 rounded w-full"
              value={med.startDate}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].startDate = e.target.value;
                setMedicines(updated);
              }}
            />
            <input
              type="text"
              placeholder="Duration"
              className="border px-3 py-2 rounded w-full"
              value={med.duration}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].duration = e.target.value;
                setMedicines(updated);
              }}
            />
            <input
              type="text"
              placeholder="Total Quantity"
              className="border px-3 py-2 rounded w-full"
              value={med.totalQuantity}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].totalQuantity = e.target.value;
                setMedicines(updated);
              }}
            />
            <input
              type="text"
              placeholder="Comments"
              className="border px-3 py-2 rounded w-full"
              value={med.comments}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].comments = e.target.value;
                setMedicines(updated);
              }}
            />
            <input
              type="text"
              placeholder="Dispensed From"
              className="border px-3 py-2 rounded w-full"
              value={med.dispensedFrom}
              onChange={(e) => {
                const updated = [...medicines];
                updated[index].dispensedFrom = e.target.value;
                setMedicines(updated);
              }}
            />
          </div>
        ))}

        {/* Button to Add More Medicines */}
        <button
          type="button"
          onClick={addMedicine}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-blue-700 rounded-3xl border-none"
        >
          + Add Medicine
        </button>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-700 rounded-3xl border-none"
          >
            Submit Prescription
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePrescription;
