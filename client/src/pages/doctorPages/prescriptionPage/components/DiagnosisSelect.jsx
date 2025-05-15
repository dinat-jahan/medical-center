import React from "react";
import axios from "axios";
import AsyncCreatableSelect from "react-select/async-creatable";
const DiagnosisSelect = ({ diagnoses, setDiagnoses }) => {
  //load from server
  const loadDiagnosisOptions = async (inputValue, callback) => {
    try {
      const res = await axios.get(
        `/doctor/diagnoses?search=${encodeURIComponent(inputValue)}`
      );
      // const opts = res.data.map((d) => ({
      //   label: d.displayName,
      //   value: {
      //     id: d._id,
      //     code: d.code,
      //     name: d.name,
      //     displayName: d.displayName,
      //     notes: d.notes,
      //   },
      // }));
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

  //persist new diagnosis
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
    }
  };

  return (
    <div>
      <label htmlFor="">Diagnosis/Symptoms</label>
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
        className="mb-2"
      />
      <small className="text-gray-500">
        Pick from common symptoms or type a new one.
      </small>
    </div>
  );
};

export default DiagnosisSelect;
