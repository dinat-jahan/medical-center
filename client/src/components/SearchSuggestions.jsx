import React, { useRef, useEffect } from "react";

const SearchSuggestions = ({
  suggestions,
  onSelect,
  fields,
  selectedIndex,
}) => {
  const suggestionsRef = useRef(null);

  // Close handled upstream

  // Scroll active item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const node = suggestionsRef.current.querySelectorAll("li")[selectedIndex];
      if (node) node.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div
      className="absolute mt-2 z-50 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
      ref={suggestionsRef}
    >
      <ul>
        {suggestions.map((suggestion, idx) => (
          <li
            key={suggestion._id || idx}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${
              idx === selectedIndex ? "bg-gray-200" : ""
            }`}
            onMouseEnter={() => {
              /* optionally set highlight on hover */
            }}
            onClick={() => onSelect(suggestion)}
          >
            {fields.map((field) => (
              <div key={field} className="text-sm text-gray-800">
                <strong>{suggestion[field]}</strong>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
