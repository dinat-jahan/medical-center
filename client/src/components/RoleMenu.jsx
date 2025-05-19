import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { roleMenus } from "../constants/index";
import SearchInput from "./SearchInput";
import SearchSuggestions from "./SearchSuggestions";

export default function RoleMenu() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  if (!user || !user.role) return null;
  const menuItems = roleMenus[user.role] || [];

  useEffect(() => setSelectedIndex(-1), [suggestions]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) return setSuggestions([]);
      try {
        const { data } = await axios.get("/doctor/search", {
          params: { q: searchTerm },
        });
        setSuggestions(data.results || []);
      } catch {}
    };
    fetchSuggestions();
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item =
        selectedIndex >= 0 ? suggestions[selectedIndex] : suggestions[0];
      selectSuggestion(item);
    }
  };

  const selectSuggestion = (item) => {
    if (item.type === "patient") navigate(`/patient-profile/${item.uniqueId}`);
    else if (item.type === "medicine")
      navigate(`/doctor/medicines/${item._id}`);
    setSearchTerm("");
  };

  return (
    <div className="hidden lg:block bg-white shadow">
      <nav className="flex justify-between items-center overflow-x-auto whitespace-nowrap px-6 py-3">
        {/* Tabs container */}
        <div className="flex space-x-4">
          {menuItems.map(({ name, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `inline-block px-4 py-2 rounded-t-lg transition-colors duration-150 ${
                  isActive
                    ? "border-b-2 border-teal-500 text-teal-600 font-semibold"
                    : "text-gray-600 hover:text-gray-800"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* Search for doctor */}
        {user.role === "doctor" && (
          <div className="relative w-64">
            <SearchInput
              placeholder="Search patient or medicine..."
              value={searchTerm}
              onChange={setSearchTerm}
              onKeyDown={handleKeyDown}
            />
            {suggestions.length > 0 && (
              <SearchSuggestions
                suggestions={suggestions}
                onSelect={selectSuggestion}
                selectedIndex={selectedIndex}
                fields={["name", "uniqueId"]}
              />
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
