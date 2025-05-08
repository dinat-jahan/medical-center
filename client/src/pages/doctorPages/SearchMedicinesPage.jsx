import React, { useEffect, useState } from 'react';

function SearchMedicinesPage() {
  const [medicine, setMedicine] = useState(null);

  useEffect(() => {
    // Dummy fetch: Replace this with your actual API if needed
    const dummyMedicine = {
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      manufacturer: 'Square Pharma',
      type: 'Tablet',
      quantity: 50,
      dosage: '500mg',
      price: 5,
      expiryDate: '2026-12-31',
      batchNumber: 'B1234',
      storageCondition: 'Keep in a cool dry place',
      sideEffects: ['Nausea', 'Allergy'],
      usageInstructions: 'Take after meals, 1 tablet 3 times a day',
    };

    // Simulate loading data
    setMedicine(dummyMedicine);

    // If using real API:
    // fetch('/api/medicines/single')
    //   .then(res => res.json())
    //   .then(data => setMedicine(data))
    //   .catch(err => console.error(err));
  }, []);

  if (!medicine) {
    return <p className="text-center  text-gray-500 mt-10">Loading medicine info...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-teal-50 shadow-lg rounded-xl p-6">
      <h2 className="text-3xl font-bold text-center text-teal-400 mb-4">{medicine.name}</h2>
      <div className="space-y-2 text-black-700">
        <p><strong>Generic Name:</strong> {medicine.genericName}</p>
        <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
        <p><strong>Type:</strong> {medicine.type}</p>
        <p><strong>Quantity:</strong> {medicine.quantity}</p>
        <p><strong>Dosage:</strong> {medicine.dosage}</p>
        <p><strong>Price:</strong> ${medicine.price}</p>
        <p><strong>Expiry Date:</strong> {medicine.expiryDate?.slice(0, 10) || 'N/A'}</p>
        <p><strong>Batch Number:</strong> {medicine.batchNumber}</p>
        <p><strong>Storage Condition:</strong> {medicine.storageCondition}</p>
        <p>
          <strong>Side Effects:</strong>{' '}
          {medicine.sideEffects?.length ? medicine.sideEffects.join(', ') : 'None'}
        </p>
        <p><strong>Usage Instructions:</strong> {medicine.usageInstructions}</p>
      </div>
    </div>
  );
}

export default SearchMedicinesPage;
