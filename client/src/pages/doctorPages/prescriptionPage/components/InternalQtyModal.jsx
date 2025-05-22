import React, { useState } from "react";

export default function InternalQtyModal({ items, onConfirm, onCancel }) {
  // Initialize local state, setting internalQuantity = requestedQuantity
  const [local, setLocal] = useState(
    items.map((m) => ({ ...m, internalQuantity: m.requestedQuantity }))
  );

  // Update a single item's internalQuantity, clamping at requestedQuantity
  const updateQty = (index, value) => {
    setLocal((prev) => {
      const next = prev.map((m, idx) =>
        idx === index
          ? { 
              ...m,
              internalQuantity: Math.min(m.requestedQuantity, value) 
            }
          : m
      );
      return next;
    });
  };

  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-2 right-2 bg-teal-500 hover:bg-teal-600 text-white w-8 h-8 flex items-center justify-center rounded-full"
          onClick={onCancel}
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Pharmacy will provide…
        </h3>

        <div className="space-y-4">
          {local.map((m, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <strong>{m.medicineName}</strong>
                <br />
                <span className="text-sm text-gray-600">
                  Requested: {m.requestedQuantity}
                </span>
              </div>
              <input
                type="number"
                min={0}
                max={m.requestedQuantity}
                value={m.internalQuantity}
                onChange={(e) => updateQty(i, Number(e.target.value))}
                className="w-20 border rounded p-1 text-center"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            type="button"
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-3xl w-full"
            onClick={() => onConfirm(local)}
          >
            OK, Save
          </button>
        </div>
      </div>
    </div>
  );
}
