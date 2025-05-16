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
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="font-semibold">{m.medicineName} {m.dose}</p>
            <p className="text-gray-700 text-sm">
              {m.frequency} ---- {m.durationDays} days
            </p>
            {m.comment && (
              <p className="italic text-sm text-gray-600 mt-1">
                Note: {m.comment}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="bg-white hover:bg-teal-500 text-gray-800 font-medium px-4 py-1 rounded-3xl text-base transition duration-200 border-gray-500"
              onClick={() => editMedicine(m.idx)}
            >
              Edit
            </button>
            <button
              type="button"
              className="bg-white hover:bg-red-700 text-gray-800 font-medium px-4 py-1 rounded-3xl text-base transition duration-200 border-gray-500"
              onClick={() => removeMedicine(m.idx)}
            >
              Remove
            </button>
          </div>
        </div>
      </li>
    ));

  return (
    <div className="col-span-2">
      <section>
        <h4 className="block text-lg font-semibold text-gray-800">
          Medicine dispensed from Medical Centre Pharmacy
        </h4>
        {internalList.length === 0 ? (
          <p>No internal medicines added.</p>
        ) : (
          <ul>{renderList(internalList)}</ul>
        )}
      </section>
      <section className="mt-4">
        <h4 className="block text-lg font-semibold text-gray-800">
          Medicine dispensed from External Pharmacy
        </h4>
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
