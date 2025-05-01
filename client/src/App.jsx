import { Link, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import Layout from "./Layout";
import ServicePage from "./pages/ServicePage";
import DoctorsPage from "./pages/DoctorsPage";
import MedicalStaffsPage from "./pages/MedicalStaffsPage";
import ContactPage from "./pages/ContactPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";

axios.defaults.baseURL = "http://localhost:2000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/medical-staffs" element={<MedicalStaffsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
