import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useNavigate } from "react-router-dom";

export default function ManageMedicinePage() {
  const navigate = useNavigate();
  const selectRef = useRef(null);

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState("all"); // 'all', 'low', 'out'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);

  const pageSize = 10;
  const lowStockThreshold = 5;

  // Fetch medicines from backend
  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("limit", pageSize);

    try {
      const { data } = await axios.get(
        `/medical-staff/medicines?${params.toString()}`
      );
      setMedicines(data.items);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message || "Error fetching medicines");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Live search suggestions
  const loadSearchOptions = async (input) => {
    if (!input) return [];
    try {
      const { data } = await axios.get(
        `/medical-staff/search-medicine?query=${encodeURIComponent(input)}`
      );
      return data;
    } catch (err) {
      console.error("Error loading suggestions:", err);
      return [];
    }
  };

  // Filter medicines by stock status
  const displayedMeds = medicines.filter((med) => {
    if (stockFilter === "low") {
      return (
        med.monthlyStockQuantity > 0 &&
        med.monthlyStockQuantity <= lowStockThreshold
      );
    }
    if (stockFilter === "out") {
      return med.monthlyStockQuantity === 0;
    }
    return true;
  });

  const openModal = (medicine) => {
    setCurrentMed(medicine);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMed(null);
  };

  // Update stock + expiry
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { addedQuantity, expiryDate } = Object.fromEntries(
      new FormData(e.target)
    );
    const increment = parseInt(addedQuantity, 10) || 0;
    const updatedStock = (currentMed.monthlyStockQuantity || 0) + increment;

    try {
      await axios.put(`/medical-staff/medicines/${currentMed._id}`, {
        monthlyStockQuantity: updatedStock,
        expiryDate,
      });
      closeModal();
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await axios.delete(`/medical-staff/medicines/${id}`);
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      {/* Unified Search */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 ml-20">
          <AsyncCreatableSelect
            ref={selectRef}
            cacheOptions
            defaultOptions
            loadOptions={loadSearchOptions}
            inputValue={inputValue}
            menuIsOpen={menuIsOpen}
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            onInputChange={(val, { action }) => {
              if (action === "input-change") {
                setInputValue(val);
                setMenuIsOpen(true);
              }
            }}
            onChange={(opt) => {
              const val = opt?.value || "";
              setSearch(val);
              setInputValue(val);
              setPage(1);
              setMenuIsOpen(false);
            }}
            onCreateOption={(input) => {
              setSearch(input);
              setInputValue(input);
              setPage(1);
              setMenuIsOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (inputValue) {
                  setSearch(inputValue);
                  setPage(1);
                  setMenuIsOpen(false);
                }
              }
            }}
            placeholder="Search by name, generic, manufacturer, dosage..."
            className="w-full"
          />
        </div>
        <select
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="all">All medicine</option>
          <option value="low">Low stock (≤{lowStockThreshold})</option>
          <option value="out">Out of stock</option>
        </select>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Print
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : displayedMeds.length === 0 ? (
        <p className="text-gray-500">No medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-800 text-white sticky top-0">
              <tr>
                <th className="px-4 py-2 ">Name</th>
                <th className="px-4 py-2">Generic</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Expiry</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {displayedMeds.map((med) => {
                const expDate = new Date(med.expiryDate);
                const isExpiringSoon =
                  (expDate - new Date()) / (1000 * 60 * 60 * 24) < 30;
                return (
                  <tr key={med._id} className="hover:bg-gray-50">
                    <td
                      className="px-4 py-2 cursor-pointer text-blue-600 hover:underline"
                      onClick={() =>
                        navigate(`/medical-staff/medicines/${med._id}`)
                      }
                    >
                      {med.name}
                    </td>
                    <td className="px-4 py-2">{med.genericName}</td>
                    <td className="px-4 py-2">{med.type}</td>
                    <td className="px-4 py-2">{med.monthlyStockQuantity}</td>
                    <td
                      className={`px-4 py-2 ${
                        isExpiringSoon ? "text-red-600 font-semibold" : ""
                      }`}
                    >
                      {new Date(med.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="pr-8 pl-8 py-2">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => openModal(med)}>
                          <PencilIcon size={18} />
                        </button>
                        <button onClick={() => handleDelete(med._id)}>
                          <TrashIcon size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Update Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold">
                Update Medicine
              </Dialog.Title>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon />
              </button>
            </div>
            {currentMed && (
              <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Current Stock: {currentMed.monthlyStockQuantity}
                  </p>
                  <label className="block text-sm font-medium mt-2">
                    Add Stock Qty
                  </label>
                  <input
                    name="addedQuantity"
                    type="number"
                    defaultValue={0}
                    min={0}
                    required
                    className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Expiry Date
                  </label>
                  <input
                    name="expiryDate"
                    type="date"
                    defaultValue={currentMed.expiryDate.split("T")[0]}
                    required
                    className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
