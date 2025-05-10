import React, { useState, useRef, useEffect } from "react";

const SearchSuggestions = ({ suggestions, onSelect, fields }) => {
  const suggestionsRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Close the suggestions if the user clicks outside of the suggestions div
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false); // Close suggestions
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute mt-12 w-full" ref={suggestionsRef}>
      {showSuggestions && (
        <ul className="bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {suggestions.length === 0 ? (
            <li className="p-2 text-center text-gray-500">
              No suggestions found
            </li>
          ) : (
            suggestions.map((suggestion, index) => (
              <li
                key={suggestion.uniqueId || suggestion.name || index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelect(suggestion)}
              >
                {/* Dynamically render based on fields */}
                {fields.map((field) => (
                  <div key={field} className="text-sm text-gray-500">
                    <strong>{suggestion[field]}</strong>
                  </div>
                ))}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchSuggestions;
