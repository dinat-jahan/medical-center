import React from "react";

const SearchSuggestions = ({ suggestions, onSelect }) => {
  return (
    <div className="absolute mt-12 w-full">
      <ul className="bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.uniqueId || suggestion.name || index}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
