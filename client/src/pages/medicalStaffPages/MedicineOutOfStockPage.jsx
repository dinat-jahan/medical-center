import React, { useEffect, useState } from "react";
import axios from "axios";

// MedicineCard: modern, dynamic card styling based on stock level
function MedicineCard({ med }) {
  const isZero = med.monthlyStockQuantity === 0;
  const isLow = med.monthlyStockQuantity > 0 && med.monthlyStockQuantity <= 5;

  const badgeText = isZero
    ? "Out of Stock"
    : `Low Stock: ${med.monthlyStockQuantity}`;

  const badgeBg = isZero ? "bg-red-100" : "bg-yellow-100";
  const badgeTextColor = isZero ? "text-red-600" : "text-yellow-600";
  const ringColor = isZero ? "ring-red-100" : "ring-yellow-100";
  const titleTextColor = isZero ? "text-red-600" : "text-yellow-600";

  return (
    <div
      className={`relative bg-white rounded-2xl p-6 shadow-md ring-1 ${ringColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}
    >
      <span
        className={`absolute top-4 right-4 ${badgeBg} ${badgeTextColor} text-xs font-semibold uppercase px-2 py-1 rounded-full`}
      >
        {badgeText}
      </span>

      <h3
        className={`text-xl font-semibold ${titleTextColor} mb-4 group-hover:opacity-90`}
      >
        {med.name}
      </h3>

      <div className="space-y-1 text-gray-700 leading-snug">
        <p>
          <span className="font-medium text-gray-900">Generic:</span>{" "}
          {med.genericName}
        </p>
        <p>
          <span className="font-medium text-gray-900">Manufacturer:</span>{" "}
          {med.manufacturer}
        </p>
        <p>
          <span className="font-medium text-gray-900">Type:</span> {med.type}
        </p>
        <p>
          <span className="font-medium text-gray-900">Batch:</span>{" "}
          {med.batchNumber}
        </p>
        <p>
          <span className="font-medium text-gray-900">Expiry:</span>{" "}
          {new Date(med.expiryDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// Loading: simple placeholder
function LoadingState() {
  return <p className="text-center text-gray-500">Loading…</p>;
}

// Error: user-friendly error message
function ErrorState({ message }) {
  return <p className="text-center text-red-500">{message}</p>;
}

// Empty: cheerful message when nothing is low or out of stock
function EmptyState() {
  return (
    <p className="text-center text-gray-500">
      All medicines are sufficiently stocked! ✅
    </p>
  );
}

// Main Low-Stock page
export default function MedicineOutOfStockPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const { data } = await axios.get(
          "/medical-staff/low-stock?threshold=5"
        );
        // Sort: out-of-stock first, then low-stock
        const sorted = data.sort((a, b) => {
          if (a.monthlyStockQuantity === 0 && b.monthlyStockQuantity !== 0)
            return -1;
          if (a.monthlyStockQuantity !== 0 && b.monthlyStockQuantity === 0)
            return 1;
          // Otherwise, sort low stock descending
          return b.monthlyStockQuantity - a.monthlyStockQuantity;
        });
        setMedicines(sorted);
      } catch (err) {
        console.error(err);
        setError("Couldn’t load medicines. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLowStock();
  }, []);

  return (
    <div className="font-sans max-w-6xl mx-auto mt-12 px-6 pb-16">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 underline decoration-gray-300 decoration-4 underline-offset-8">
        Medicines Low & Out of Stock
      </h2>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : medicines.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicines.map((med) => (
            <MedicineCard key={med._id} med={med} />
          ))}
        </div>
      )}
    </div>
  );
}
