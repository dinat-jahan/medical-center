import { roleMenus } from "../constants/index";
import { UserContext } from "../UserContext";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchInput from "./SearchInput";
import SearchSuggestions from "./SearchSuggestions";
import axios from "axios";
const RoleMenu = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(0);
  const [patientSearch, setPatientSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);

  if (!user || !user.role) return null;

  const menuItems = roleMenus[user.role];
  if (!menuItems) return null;

  useEffect(() => {
    const fetchPatientSuggestions = async () => {
      if (patientSearch.trim() === "") {
        setPatientSuggestions([]);
        return;
      }
      try {
        const { data } = await axios.get("/doctor/search-patient", {
          params: { patient: patientSearch },
        });
        setPatientSuggestions(data.patients || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatientSuggestions();
  }, [patientSearch]);

  useEffect(() => {
    const fetchMedicineSuggestions = async () => {
      if (medicineSearch.trim() === "") {
        setMedicineSuggestions([]);
        return;
      }
      try {
        const { data } = await axios.get("/doctor/search-medicine");
        setMedicineSuggestions(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMedicineSuggestions();
  }, [patientSearch]);

  const handlePatientSelect = (patient) => {
    console.log("Selected patient", patient);
  };

  const handleMedicineSelect = (medicine) => {
    // Handle medicine selection (e.g., navigate to the medicine details)
    console.log("Selected Medicine:", medicine);
  };

  return (
    <div className="lg:block hidden">
      <nav className="flex flex-row gap-2 p-4 bg-gray-100 rounded-lg">
        <div className="tabs tabs-lift" role="tablist">
          {menuItems.map((item, index) => {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`tab ${activeTab === index ? "tab-active" : ""}`}
                role="tab"
                onClick={() => setActiveTab(index)}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Conditionally render search options for doctor role */}
          {user.role === "doctor" && (
            <div className="flex gap-4 ml-4 relative">
              {/* Search Patient */}
              <SearchInput
                placeholder="Search Patient by id, name..."
                value={patientSearch}
                onChange={setPatientSearch}
              />
              {/* Show suggestions only if there are any */}
              {patientSuggestions.length > 0 && (
                <SearchSuggestions
                  suggestions={patientSuggestions}
                  onSelect={handlePatientSelect} // Pass the selection handler
                />
              )}
              {/* Search Medicine */}
              <SearchInput
                placeholder="Search Medicine"
                value={medicineSearch}
                onChange={setMedicineSearch}
              />
              <SearchSuggestions
                suggestions={medicineSuggestions}
                onSelect={handleMedicineSelect}
              />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default RoleMenu;
