import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useNavigate } from "react-router-dom";

export default function ManageMedicinePage() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [genericFilter, setGenericFilter] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);

  const pageSize = 10;

  // Fetch table data based on search and filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (genericFilter) params.append("genericName", genericFilter);
    if (manufacturerFilter) params.append("manufacturer", manufacturerFilter);
    params.append("page", page);
    params.append("limit", pageSize);

    axios
      .get(`/medical-staff/medicines?${params.toString()}`)
      .then(({ data }) => {
        setMedicines(data.items);
        setTotalPages(data.totalPages);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, genericFilter, manufacturerFilter, page]);

  // Load suggestions for search
  const loadSearchOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const { data } = await axios.get(
        `/medical-staff/search-medicine?query=${encodeURIComponent(inputValue)}`
      );
      return data;
    } catch (err) {
      console.error("Error loading suggestions:", err);
      return [];
    }
  };

  const openModal = (medicine) => {
    setCurrentMed(medicine);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMed(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { quantity, expiryDate } = Object.fromEntries(new FormData(e.target));
    try {
      await axios.put(`/medical-staff/medicines/${currentMed._id}`, {
        quantity,
        expiryDate,
      });
      setPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await axios.delete(`/medical-staff/medicines/${id}`);
      setPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <AsyncCreatableSelect
          cacheOptions
          defaultOptions
          loadOptions={loadSearchOptions}
          onChange={(option) => {
            if (option) {
              setSearch(option.value);
              setPage(1);
            } else {
              setSearch("");
            }
          }}
          onCreateOption={(input) => {
            setSearch(input);
            setPage(1);
          }}
          placeholder="Search by name, generic, manufacturer or dosage"
          className="col-span-1 md:col-span-4"
        />
        <input
          type="text"
          placeholder="Filter by generic name"
          value={genericFilter}
          onChange={(e) => setGenericFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
        />
        <input
          type="text"
          placeholder="Filter by manufacturer"
          value={manufacturerFilter}
          onChange={(e) => setManufacturerFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
        />
        <button
          onClick={() => setPage(1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : medicines.length === 0 ? (
        <p className="text-gray-500">No medicines found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-800 text-white sticky top-0">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Generic</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Expiry</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => {
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
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
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
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    defaultValue={currentMed.quantity}
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
