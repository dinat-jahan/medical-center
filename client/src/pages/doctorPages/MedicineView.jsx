import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function MedicineView() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const params = { page, limit };
        if (search) params.search = search;
        if (filterType) params.type = filterType;

        const { data } = await axios.get("/doctor/medicines", { params });
        if (data.success) {
          setMedicines(data.medicines);
        }
      } catch (err) {
        console.error("Error fetching medicines:", err);
      }
    };
    fetchMedicines();
  }, [search, filterType, page]);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Medicine Catalogue
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full sm:w-64 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="w-full sm:w-48 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Types</option>
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
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-xl rounded-lg overflow-hidden">
          <thead className="bg-indigo-50">
            <tr>
              {[
                { label: "Brand", key: "name" },
                { label: "Generic", key: "genericName" },
                { label: "Type", key: "type" },
                { label: "Monthly Stock", key: "monthlyStockQuantity" },
                { label: "Expiry", key: "expiryDate" },
                { label: "Price (BDT)", key: "price" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left p-4 text-gray-700 uppercase text-sm"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <motion.tr
                key={med._id}
                whileHover={{ backgroundColor: "#f1f5f9" }}
                transition={{ duration: 0.2 }}
                className="border-b last:border-none"
              >
                <td className="p-4">
                  <Link
                    to={`/doctor/medicines/${med._id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    {med.name}
                  </Link>
                </td>
                <td className="p-4 text-gray-600">{med.genericName}</td>
                <td className="p-4 text-gray-600">{med.type}</td>
                <td className="p-4 text-gray-600">
                  {med.monthlyStockQuantity}
                </td>
                <td className="p-4 text-gray-600">
                  {new Date(med.expiryDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-gray-600">{formatPrice(med.price)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {medicines.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No medicines match your criteria.
        </p>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="w-8 h-8 flex bg-slate-200 items-center justify-center text-gray-600 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          &larr;
        </button>
        <span className="text-gray-700 text-sm">{page}</span>
        <button
          className="w-8 h-8 flex items-center justify-center text-gray-600 border border-gray-300 rounded bg-slate-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={medicines.length < limit}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
