import React from "react";

const MedicineList = ({ items, setItems, setEntry }) => {
  const removeMedicine = (idx) => {
    console.log("Removing item at", idx);
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const editMedicine = (idx) => {
    console.log("Editing item at", idx, items[idx]);
    const m = items[idx];
    setEntry({
      medicine: m.medicine,
      medicineName: m.medicineName,
      frequency: m.frequency,
      frequencyCustom: "",
      durationDays: m.durationDays,
      durationCustom: "",
      comment: m.comment || "",
    });
    removeMedicine(idx);
  };

  // include original index for proper edit/remove
  const internalList = items
    .map((m, i) => ({ ...m, idx: i }))
    .filter((m) => m.dispensedFrom === "internal");
  const externalList = items
    .map((m, i) => ({ ...m, idx: i }))
    .filter((m) => m.dispensedFrom === "external");

  const renderList = (list) =>
    list.map((m) => (
      <li key={m.idx} className="mb-3 border-b pb-2">
        <p>
          <strong>{m.medicineName}</strong> — {m.frequency}, {m.durationDays}d,
          Qty: {m.requestedQuantity}
        </p>
        {m.comment && <p className="italic text-sm mt-1">Note: {m.comment}</p>}
        <div className="mt-1">
          <button
            type="button"
            className="text-blue-600 mr-4"
            onClick={() => editMedicine(m.idx)}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-red-600"
            onClick={() => removeMedicine(m.idx)}
          >
            Remove
          </button>
        </div>
      </li>
    ));

  return (
    <div className="col-span-2">
      <section>
        <h4>Internal Pharmacy</h4>
        {internalList.length === 0 ? (
          <p>No internal medicines added.</p>
        ) : (
          <ul>{renderList(internalList)}</ul>
        )}
      </section>
      <section className="mt-4">
        <h4>External Pharmacy</h4>
        {externalList.length === 0 ? (
          <p>No external medicines added.</p>
        ) : (
          <ul>{renderList(externalList)}</ul>
        )}
      </section>
    </div>
  );
};

export default MedicineList;
