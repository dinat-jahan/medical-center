import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react";

export default function EditMedicinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    type: "",
    mainStockQuantity: 0,
    monthlyStockQuantity: 0,
    dosage: "",
    manufacturer: "",
    price: "",
    expiryDate: "",
    batchNumber: "",
    storageCondition: "",
    sideEffects: [],
    usageInstructions: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/medical-staff/medicines/${id}`)
      .then(({ data }) => {
        setFormData({
          name: data.name || "",
          genericName: data.genericName || "",
          type: data.type || "",
          mainStockQuantity: data.mainStockQuantity || 0,
          monthlyStockQuantity: data.monthlyStockQuantity || 0,
          dosage: data.dosage || "",
          manufacturer: data.manufacturer || "",
          price: data.price || "",
          expiryDate: data.expiryDate ? data.expiryDate.split("T")[0] : "",
          batchNumber: data.batchNumber || "",
          storageCondition: data.storageCondition || "",
          sideEffects: data.sideEffects || [],
          usageInstructions: data.usageInstructions || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSideEffectsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      sideEffects: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/medical-staff/medicines/${id}`, formData);
      navigate(`/medical-staff/medicines/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-3xl shadow-xl mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 transition w-1/12"
          aria-label="Go back"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Edit Medicine
        </h1>
        <div />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input helper */}
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Generic Name", name: "genericName", type: "text" },
          { label: "Type", name: "type", type: "text" },
          { label: "Dosage", name: "dosage", type: "text" },
          { label: "Manufacturer", name: "manufacturer", type: "text" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 text-gray-600 font-medium">
              {field.label}
            </label>
            <input
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Main Stock Qty",
              name: "mainStockQuantity",
              type: "number",
            },
            {
              label: "Monthly Stock Qty",
              name: "monthlyStockQuantity",
              type: "number",
            },
            { label: "Price", name: "price", type: "text" },
            { label: "Expiry Date", name: "expiryDate", type: "date" },
            { label: "Batch Number", name: "batchNumber", type: "text" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-600 font-medium">
            Storage Condition
          </label>
          <textarea
            name="storageCondition"
            rows={2}
            value={formData.storageCondition}
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-600 font-medium">
            Side Effects (comma separated)
          </label>
          <input
            name="sideEffects"
            type="text"
            value={formData.sideEffects.join(", ")}
            onChange={handleSideEffectsChange}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-600 font-medium">
            Usage Instructions
          </label>
          <textarea
            name="usageInstructions"
            rows={3}
            value={formData.usageInstructions}
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
