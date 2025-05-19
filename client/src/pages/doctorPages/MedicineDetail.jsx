import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";

export default function MedicineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/doctor/medicines/${id}`)
      .then(({ data }) => setMedicine(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!medicine) return <p className="p-6 text-gray-500">No data found.</p>;

  const {
    name,
    genericName,
    dosage,
    type,
    manufacturer,
    mainStockQuantity,
    monthlyStockQuantity,
    price,
    expiryDate,
    batchNumber,
    storageCondition,
    sideEffects,
    usageInstructions,
  } = medicine;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hero Section with buttons inside for clean layout */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-2xl p-8 shadow-lg">
        {/* Small icon-only back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transition"
          aria-label="Go back"
        >
          <ArrowLeftIcon size={16} />
        </button>

        {/* <button
          onClick={() => navigate(`/medicines/${id}/edit`)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transition"
          aria-label="Edit medicine"
        >
          <PencilIcon size={16} />
        </button> */}
        <h1 className="text-4xl font-extrabold leading-tight">{name}</h1>
        <p className="mt-2 text-lg italic opacity-90">
          {genericName} • {dosage || "N/A"}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {[
          { label: "Form", value: type },
          { label: "Manufacturer", value: manufacturer || "N/A" },
          { label: "Main Stock Qty", value: mainStockQuantity },
          { label: "Monthly Stock Qty", value: monthlyStockQuantity },
          { label: "Price", value: price ? `$${price.toFixed(2)}` : "N/A" },
          {
            label: "Expiry Date",
            value: new Date(expiryDate).toLocaleDateString(),
          },
          { label: "Batch Number", value: batchNumber || "N/A" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {item.label}
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-700">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Extended Info */}
      <div className="mt-8 space-y-8">
        <section className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Storage Condition</h2>
          <p className="text-gray-600">
            {storageCondition || "Store at room temperature away from light."}
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Side Effects</h2>
          {sideEffects && sideEffects.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {sideEffects.map((se, i) => (
                <li key={i}>{se}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">None listed.</p>
          )}
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Usage Instructions</h2>
          <p className="text-gray-600 whitespace-pre-wrap">
            {usageInstructions || "No specific instructions provided."}
          </p>
        </section>
      </div>
    </div>
  );
}
