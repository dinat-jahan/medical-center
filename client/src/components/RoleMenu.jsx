import { roleMenus } from "../constants/index";
import { UserContext } from "../UserContext";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  if (!user || !user.role) return null;

  const menuItems = roleMenus[user.role];
  if (!menuItems) return null;
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

  // Move this function outside useEffect for both useEffect and button click access
  const fetchMedicineSuggestions = async () => {
    if (medicineSearch.trim() === "") {
      setMedicineSuggestions([]);
      return;
    }
    try {
      const { data } = await axios.get("/doctor/search-medicine", {
        params: { medicine: medicineSearch }, // Send medicine search query to backend
      });
      setMedicineSuggestions(data.medicines || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMedicineSuggestions(); // fetch medicine suggestions whenever the search input changes
  }, [medicineSearch]);

  const handlePatientSelect = (patient) => {
    console.log("Selected patient", patient);
    navigate(`/patient-profile/${patient.uniqueId}`);
  };

  const handleMedicineSearchClick = () => {
    navigate(`search-medicine/${medicineSearch}`);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      fetchPatientSuggestions(); // Trigger patient search when Enter key is pressed
    }
  };

  useEffect(() => {
    fetchPatientSuggestions(); // Fetch patient suggestions when the patient search input changes
  }, [patientSearch]);

  const handleMedicineSelect = (medicine) => {
    console.log("Selected Medicine:", medicine);
    navigate(`/search-medicine/${medicine._id}`);
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
                onKeyPress={handleEnterPress}
              />
              <button>Search</button>
              {/* Show suggestions only if there are any */}
              {patientSuggestions.length > 0 && (
                <SearchSuggestions
                  suggestions={patientSuggestions}
                  onSelect={handlePatientSelect} // Pass the selection handler
                  fields={["name", "uniqueId"]}
                />
              )}
              {/* Search Medicine */}
              <SearchInput
                placeholder="Search Medicine"
                value={medicineSearch}
                onChange={setMedicineSearch}
              />{" "}
              <button
                onClick={handleMedicineSearchClick}
                className="bg-red-500 text-white p-2 rounded"
              >
                Search
              </button>
              {/* Show suggestions for medicines */}
              {medicineSuggestions.length > 0 && (
                <SearchSuggestions
                  suggestions={medicineSuggestions}
                  onSelect={handleMedicineSelect}
                  fields={["name", "genericName", "manufacturer"]}
                />
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default RoleMenu;
