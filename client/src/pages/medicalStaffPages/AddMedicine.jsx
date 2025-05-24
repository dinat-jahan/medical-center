import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddMedicine() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    type: "Tablet",
    mainStockQuantity: 0,
    monthlyStockQuantity: 0,
    dosage: "",
    manufacturer: "",
    expiryDate: "",
    batchNumber: "",
    price: 0,
    storageCondition: "",
    sideEffects: "",
    usageInstructions: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        sideEffects: form.sideEffects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const { data } = await axios.post("/medical-staff/add-medicine", payload);
      navigate(`/medical-staff/medicines/${data.medicine._id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add medicine");
    }
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-4xl scroll-smooth">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-primary">
        Add New Medicine
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white shadow-lg rounded-xl p-6 md:p-10 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Brand Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Generic Name *
            </label>
            <input
              name="genericName"
              value={form.genericName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            >
              {[
                "Tablet",
                "Capsule",
                "Syrup",
                "Injection",
                "Ointment",
                "Eye Drops",
                "Powder",
                "Gel",
                "Lotion",
                "Other",
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Main Stock Qty *
            </label>
            <input
              type="number"
              name="mainStockQuantity"
              min="0"
              value={form.mainStockQuantity}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Monthly Stock Qty *
            </label>
            <input
              type="number"
              name="monthlyStockQuantity"
              min="0"
              value={form.monthlyStockQuantity}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dosage</label>
            <input
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Manufacturer
            </label>
            <input
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Batch Number
            </label>
            <input
              name="batchNumber"
              value={form.batchNumber}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Storage Condition
            </label>
            <input
              name="storageCondition"
              value={form.storageCondition}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Side Effects (comma-separated)
            </label>
            <input
              name="sideEffects"
              value={form.sideEffects}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Usage Instructions
            </label>
            <textarea
              name="usageInstructions"
              value={form.usageInstructions}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Save Medicine
          </button>
        </div>
      </form>
    </div>
  );
}
