import { useState, useEffect } from "react";

export default function ManageMedicinePage() {
  // Dummy medicine data, to be replaced by backend call
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const dummy = [
      {
        _id: "1",
        name: "Napa",
        genericName: "Paracetamol",
        type: "Tablet",
        quantity: 100,
        expiryDate: "2025-12-31",
      },
      {
        _id: "2",
        name: "Seclo",
        genericName: "Omeprazole",
        type: "Capsule",
        quantity: 50,
        expiryDate: "2026-06-30",
      },
    ];
    setMedicines(dummy);
  }, []);

  // Handle medicine update
  const handleUpdate = (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedQuantity = formData.get("quantity");
    const updatedDate = formData.get("expiryDate");

    console.log("Updating:", id, updatedQuantity, updatedDate);
    // Later: send updated data to backend
  };

  // Handle medicine delete
  const handleDelete = (id) => {
    console.log("Deleting:", id);
    // Later: send delete request to backend
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Medicine List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border px-4 py-2" scope="col">Name</th>
              <th className="border px-4 py-2" scope="col">Generic Name</th>
              <th className="border px-4 py-2" scope="col">Type</th>
              <th className="border px-4 py-2" scope="col">Quantity</th>
              <th className="border px-4 py-2" scope="col">Expiry Date</th>
              <th className="border px-4 py-2" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine._id}>
                <td className="border px-4 py-2">{medicine.name}</td>
                <td className="border px-4 py-2">{medicine.genericName}</td>
                <td className="border px-4 py-2">{medicine.type}</td>
                <td className="border px-4 py-2">{medicine.quantity}</td>
                <td className="border px-4 py-2">{medicine.expiryDate}</td>
                <td className="border px-4 py-2">
                  <form
                    onSubmit={(e) => handleUpdate(e, medicine._id)}
                    className="flex flex-col gap-2 md:flex-row md:items-center"
                  >
                    <input
                      type="number"
                      name="quantity"
                      defaultValue={medicine.quantity}
                      required
                      className="border border-gray-400 px-2 py-1 rounded text-sm"
                      title="Update quantity"
                    />
                    <input
                      type="date"
                      name="expiryDate"
                      defaultValue={medicine.expiryDate}
                      required
                      className="border border-gray-400 px-2 py-1 rounded text-sm"
                      title="Update expiry date"
                    />
                    <button
                      type="submit"
                      className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Update
                    </button>
                  </form>
                  <button
                    onClick={() => handleDelete(medicine._id)}
                    className="mt-2 md:mt-0 md:ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {medicines.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
