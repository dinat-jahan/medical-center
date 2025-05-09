import React, { useEffect, useState } from 'react';

function MedicineOutOfStockPage() {
  const [outOfStockMedicines, setOutOfStockMedicines] = useState([]);

  useEffect(() => {
    // Dummy data for now; replace with actual API call later
    const dummyData = [
      {
        _id: '1',
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        manufacturer: 'Beximco Pharma',
        type: 'Tablet',
        batchNumber: 'B9001',
        expiryDate: '2025-11-01',
      },
      {
        _id: '2',
        name: 'Salbutamol',
        genericName: 'Salbutamol Sulphate',
        manufacturer: 'Renata Ltd.',
        type: 'Inhaler',
        batchNumber: 'B7542',
        expiryDate: '2024-09-10',
      },
    ];

    setOutOfStockMedicines(dummyData);
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold text-center text-red-600 mb-6">
        Out of Stock Medicines
      </h2>

      {outOfStockMedicines.length === 0 ? (
        <p className="text-center text-gray-500">All medicines are in stock.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outOfStockMedicines.map((medicine) => (
            <div
              key={medicine._id}
              className="bg-white border border-red-300 shadow-sm rounded-lg p-4"
            >
              <h3 className="text-xl font-bold text-center text-red-500 mb-2">{medicine.name}</h3>
              <p><strong>Generic Name:</strong> {medicine.genericName}</p>
              <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
              <p><strong>Type:</strong> {medicine.type}</p>
              <p><strong>Batch Number:</strong> {medicine.batchNumber}</p>
              <p><strong>Expiry Date:</strong> {medicine.expiryDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicineOutOfStockPage;
