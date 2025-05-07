import React from "react";

const SearchInput = ({ placeholder, value, onChange }) => {
  return (
    <div>
      {/* <label className="block text-sm font-semibold">{placeholder}</label> */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mt-2"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
