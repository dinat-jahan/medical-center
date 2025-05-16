import React from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "axios";

const MedicineEntry = ({ entry, setEntry, items, setItems }) => {
  const loadMedicineOptions = async (inputValue, callback) => {
    try {
      const { data } = await axios.get(
        `/doctor/pres/medicines?search=${encodeURIComponent(inputValue)}`
      );
      const opts = data.map((m) => ({
        label: `${m.name} (${m.genericName})${m.dosage ? " - " + m.dosage : ""}`,
        value: m,
      }));
      callback(opts);
    } catch (err) {
      console.log(err);
      callback([]);
    }
  };

  const duratonOptions = [
    ...Array.from({ length: 10 }, (_, i) => ({
      label: `${i + 1} day`,
      value: String(i + 1),
    })),
    { label: "15 days", value: "15" },
    { label: "30 days", value: "30" },
    { label: "1 month (30d)", value: "30" },
    { label: "2 months (60d)", value: "60" },
    { label: "Other", value: "Other" },
  ];

  const handleAddMedicine = () => {
    if (!entry.medicineName) return;

    const frequency =
      entry.frequency === "Other" ? entry.frequencyCustom : entry.frequency;
    const duration =
      entry.durationDays === "Other" ? entry.durationCustom : entry.durationDays;

    const requestedQuantity =
      parseInt(duration, 10) *
      frequency
        .split("+")
        .map((n) => parseInt(n, 10) || 0)
        .reduce((a, b) => a + b, 0);

    const dispensedFrom =
      entry.medicine && entry.medicine.monthlyStockQuantity > 0
        ? "internal"
        : "external";

    const internalQuantity =
      dispensedFrom === "external" ? 0 : requestedQuantity;

    setItems((prev) => [
      ...prev,
      {
        ...entry,
        frequency,
        durationDays: duration,
        requestedQuantity,
        internalQuantity,
        dispensedFrom,
        comment: entry.comment || "",
      },
    ]);

    setEntry({
      medicine: null,
      medicineName: "",
      dose: "",
      frequency: "",
      frequencyCustom: "",
      durationDays: "",
      durationCustom: "",
      comment: "",
    });
  };

  return (
    <div>
      <h3 className="block text-lg font-semibold text-gray-800">Medicines</h3>

      {/* Medicine name and dose side by side */}
      <div className="flex gap-4 mt-2">
        <div className="w-1/2 mt-2">
          <AsyncCreatableSelect
            cacheOptions
            loadOptions={loadMedicineOptions}
            isClearable
            onChange={(opt, meta) => {
              if (!opt) {
                setEntry((prev) => ({
                  ...prev,
                  medicine: null,
                  medicineName: "",
                  dose: "",
                }));
                return;
              }
              if (meta.action === "create-option") {
                setEntry((prev) => ({
                  ...prev,
                  medicine: null,
                  medicineName: opt.label,
                  dose: "",
                }));
              } else {
                setEntry((prev) => ({
                  ...prev,
                  medicine: opt.value,
                  medicineName: opt.value.name,
                  dose: opt.value.dosage || "",
                }));
              }
            }}
            onCreateOption={(inputVal) => {
              setEntry((prev) => ({
                ...prev,
                medicine: null,
                medicineName: inputVal,
                dose: "",
              }));
            }}
            value={
              entry.medicine
                ? {
                    label: `${entry.medicine.name} (${entry.medicine.genericName})${
                      entry.medicine.dosage ? " - " + entry.medicine.dosage : ""
                    }`,
                    value: entry.medicine,
                  }
                : entry.medicineName
                ? { label: entry.medicineName, value: null }
                : null
            }
            placeholder="Search or type medicine name…"
          />
        </div>

        <div className="w-1/2 mb-2">
          <input
            type="text"
            className="w-full border p-1 rounded border-gray-800 mb-2"
            placeholder="Dose (e.g., 500 mg)"
            value={entry.dose}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, dose: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Frequency & Duration side by side */}
      <div className="flex gap-4 mt-2">
        {/* Frequency input */}
        <div className="w-1/2">
          <label className="block text-lg font-semibold text-gray-800">Frequency</label>
          {entry.frequency !== "Other" ? (
            <select
              name="frequency"
              value={entry.frequency}
              onChange={(e) =>
                setEntry((prev) => ({
                  ...prev,
                  frequency: e.target.value,
                }))
              }
              className="w-full border p-1 rounded"
            >
              <option value="">Select frequency</option>
              <option value="1+1+1">1+1+1</option>
              <option value="1+0+1">1+0+1</option>
              <option value="1+0+0">1+0+0</option>
              <option value="0+1+0">0+1+0</option>
              <option value="0+0+1">0+0+1</option>
              <option value="1+1+0">1+1+0</option>
              <option value="0+1+1">0+1+1</option>
              <option value="1+1+1+1">1+1+1+1</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <input
              name="frequencyCustom"
              value={entry.frequencyCustom}
              onChange={(e) =>
                setEntry((prev) => ({
                  ...prev,
                  frequencyCustom: e.target.value,
                }))
              }
              className="w-full border p-1 rounded"
              placeholder="Custom frequency"
            />
          )}
        </div>

        {/* Duration input */}
        <div className="w-1/2">
          <label className="block text-lg font-semibold text-gray-800">Duration</label>
          {entry.durationDays !== "Other" ? (
            <select
              name="durationDays"
              value={entry.durationDays}
              onChange={(e) =>
                setEntry((prev) => ({
                  ...prev,
                  durationDays: e.target.value,
                }))
              }
              className="w-full border p-1 rounded"
            >
              <option value="">Select duration</option>
              {duratonOptions.map((opt, idx) => (
                <option key={`${opt.value}-${idx}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              name="durationCustom"
              value={entry.durationCustom}
              onChange={(e) =>
                setEntry((prev) => ({
                  ...prev,
                  durationCustom: e.target.value,
                }))
              }
              className="w-full border p-1 rounded"
              placeholder="Custom days"
            />
          )}
        </div>
      </div>

      {/* Comment field */}
      <textarea
        className="w-full border p-1 rounded mt-2"
        placeholder="Comment (optional)"
        value={entry.comment}
        onChange={(e) =>
          setEntry((prev) => ({ ...prev, comment: e.target.value }))
        }
      />

      <div className="flex justify-center mt-4">
        <button
          onClick={handleAddMedicine}
          className="bg-teal-500 hover:bg-teal-700 text-white font-medium w-[350px] border-none px-6 py-2 rounded-3xl text-lg transition duration-200"
        >
          + Add Medicine
        </button>
      </div>
    </div>
  );
};

export default MedicineEntry;
