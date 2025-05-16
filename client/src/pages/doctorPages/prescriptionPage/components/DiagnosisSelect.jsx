import React from "react";
import axios from "axios";
import AsyncCreatableSelect from "react-select/async-creatable";

const DiagnosisSelect = ({ diagnoses, setDiagnoses }) => {
  // Load from server
  const loadDiagnosisOptions = async (inputValue, callback) => {
    try {
      const res = await axios.get(`/doctor/diagnoses?search=${encodeURIComponent(inputValue)}`);
      const opts = res.data.map((d) => ({
        label: d.displayName,
        value: d,
      }));
      callback(opts);
    } catch (err) {
      console.error("Failed to load diagnoses", err);
      callback([]);
    }
  };

  // Persist new diagnosis
  const handleCreate = async (inputValue) => {
    try {
      const res = await axios.post("/doctor/diagnoses", {
        code: "",
        name: inputValue,
        displayName: inputValue,
      });
      setDiagnoses((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error creating diagnosis", err);
      // fallback: push as free-text entry if server creation fails
      setDiagnoses((prev) => [
        ...prev,
        { _id: null, name: inputValue, displayName: inputValue },
      ]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold text-gray-800" >
        Diagnosis / Symptoms
      </label>

      <div className="custom-react-select-container">
        <AsyncCreatableSelect
          isMulti
          cacheOptions
          defaultOptions
          loadOptions={loadDiagnosisOptions}
          onChange={(selected) => setDiagnoses(selected.map((opt) => opt.value))}
          onCreateOption={handleCreate}
          value={diagnoses.map((d) => ({
            label: d.displayName,
            value: d,
          }))}
          placeholder="Type or select a diagnosis..."
          classNamePrefix="react-select"
        />
      </div>

      <p className="text-xs text-gray-800 italic">
        Pick from common diagnoses or create a new one.
      </p>
    </div>
  );
};

export default DiagnosisSelect;
