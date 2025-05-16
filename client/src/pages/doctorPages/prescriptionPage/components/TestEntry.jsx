import React from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "axios";

export default function TestEntry({ tests, setTests }) {
  // Load matching tests from the server
  const loadOptions = async (inputValue) => {
    const response = await axios.get(
      `/doctor/tests?search=${encodeURIComponent(inputValue)}`
    );
    return response.data.map((test) => ({ label: test.name, value: test }));
  };

  // When doctor selects or clears options
  const handleChange = (options) => {
    setTests(options ? options.map((o) => o.value) : []);
  };

  // When doctor creates a new test entry
  const handleCreate = (inputValue) => {
    // push a “free‐text” test entry with no ObjectId
    setTests((prev) => [...prev, { _id: null, name: inputValue }]);
  };

  // Show currently selected tests as options
  const selectedOptions = tests.map((t) => ({ label: t.name, value: t }));

  return (
    <div className="col-span-2">
      <label className="block text-lg font-medium text-gray-800">
        Recommended Tests
      </label>
      <AsyncCreatableSelect
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        onCreateOption={handleCreate}
        value={selectedOptions}
        placeholder="Search or add tests..."
      />
    </div>
  );
}
