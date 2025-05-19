import React from "react";

const SearchInput = ({ placeholder, value, onChange, onKeyDown }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="w-full p-2 border border-gray-300 rounded mt-2"
      placeholder={placeholder}
    />
  );
};

export default SearchInput;
