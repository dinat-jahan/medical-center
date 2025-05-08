import React from "react";

const ManageMedicinePage = ({ medicines, onUpdate, onDelete }) => {
  return (
    <div className="bg-[#edf2f4] p-5 rounded-lg">
      <h2 className="text-2xl font-semibold text-[#2b2d42] mb-4">Medicine List</h2>
      <table className="w-full table-auto bg-white border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-[#2b2d42] text-[#edf2f4] text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Generic Name</th>
            <th className="p-3">Type</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Expiry Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine._id} className="border-t border-gray-200">
              <td className="p-3">{medicine.name}</td>
              <td className="p-3">{medicine.genericName}</td>
              <td className="p-3">{medicine.type}</td>
              <td className="p-3">{medicine.quantity}</td>
              <td className="p-3">{new Date(medicine.expiryDate).toISOString().split("T")[0]}</td>
              <td className="p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const updatedQuantity = form.quantity.value;
                    const updatedExpiryDate = form.expiryDate.value;
                    onUpdate(medicine._id, updatedQuantity, updatedExpiryDate);
                  }}
                  className="inline-block space-x-2"
                >
                  <label htmlFor="quantity" className="text-sm mr-1">Qty</label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={medicine.quantity}
                    required
                    className="border border-gray-400 rounded px-2 py-1 text-sm"
                  />
                  <label htmlFor="expiryDate" className="text-sm ml-2 mr-1">Expiry</label>
                  <input
                    type="date"
                    name="expiryDate"
                    defaultValue={new Date(medicine.expiryDate).toISOString().split("T")[0]}
                    required
                    className="border border-gray-400 rounded px-2 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-[#2b2d42] text-[#edf2f4] px-3 py-1 rounded text-sm ml-2"
                  >
                    Update
                  </button>
                </form>
                <button
                  onClick={() => onDelete(medicine._id)}
                  className="bg-[#d90429] text-[#edf2f4] px-3 py-1 rounded text-sm ml-3"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageMedicinePage;
