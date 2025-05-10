import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get URL params
import axios from "axios";

function SearchMedicinesPage() {
  const { medicineId } = useParams();
  // Get the medicineId from the URL
  console.log(medicineId);
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch medicine data using the medicineId
    const fetchMedicineData = async () => {
      try {
        console.log(medicineId);
        const response = await axios(`/doctor/medicine/${medicineId}`);
        console.log(response.data);
        setMedicine(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.log(err);
        setLoading(false);
      }
    };

    fetchMedicineData();
  }, [medicineId]); // Re-run the effect if medicineId changes

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading medicine info...
      </p>
    );
  }

  // if (error) {
  //   return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  // }

  if (!medicine) {
    return <p className="text-center text-gray-500 mt-10">No medicine found</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-teal-50 shadow-lg rounded-xl p-6">
      <h2 className="text-3xl font-bold text-center text-teal-400 mb-4">
        {medicine.name}
      </h2>
      <div className="space-y-2 text-black-700">
        <p>
          <strong>Generic Name:</strong> {medicine.genericName}
        </p>
        <p>
          <strong>Manufacturer:</strong> {medicine.manufacturer}
        </p>
        <p>
          <strong>Type:</strong> {medicine.type}
        </p>
        <p>
          <strong>Monthly Stock Quantity:</strong>{" "}
          {medicine.monthlyStockQuantity}
        </p>
        <p>
          <strong>Dosage:</strong> {medicine.dosage}
        </p>
        <p>
          <strong>Price:</strong> ${medicine.price}
        </p>
        <p>
          <strong>Expiry Date:</strong>{" "}
          {medicine.expiryDate?.slice(0, 10) || "N/A"}
        </p>
        <p>
          <strong>Batch Number:</strong> {medicine.batchNumber}
        </p>
        <p>
          <strong>Storage Condition:</strong> {medicine.storageCondition}
        </p>
        <p>
          <strong>Side Effects:</strong>{" "}
          {medicine.sideEffects?.length
            ? medicine.sideEffects.join(", ")
            : "None"}
        </p>
        <p>
          <strong>Usage Instructions:</strong> {medicine.usageInstructions}
        </p>
      </div>
    </div>
  );
}

export default SearchMedicinesPage;
