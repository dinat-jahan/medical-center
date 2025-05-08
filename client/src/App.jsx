import { Link, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import Layout from "./Layout";
import ServicePage from "./pages/ServicePage";
import DoctorsPage from "./pages/DoctorsPage";
import MedicalStaffsPage from "./pages/MedicalStaffsPage";
import ContactPage from "./pages/ContactPage";
import AddMember from "./pages/universityAdminPages/AddMember";
import RegisterPage from "./pages/authPages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SetPasswordPage from "./pages/authPages/SetPasswordPage";
import { UserContextProvider } from "./UserContext";
import axios from "axios";
import AvailableMedicine from "./pages/AvailableMedicine";
import PrivateRoute from "./PrivateRoute";
import AccessDenied from "./AccessDeniedPage";
import AboutPage from "./pages/AboutPage";
import GoogleRedirect from "./pages/authPages/GoogleRedirectPage";
import SetPasswordGoogle from "./pages/authPages/SetPasswordGoogle";
axios.defaults.baseURL = "http://localhost:2000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      {" "}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/medical-staffs" element={<MedicalStaffsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute
                element={ProfilePage}
                roles={["patient", "doctor", "medical-staff"]}
              />
            }
          />

          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route path="/available-medicine" element={<AvailableMedicine />} />
          <Route
            path="/university-admin/add-member"
            element={
              <PrivateRoute element={AddMember} roles={["university-admin"]} />
            }
          />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/google-redirect" element={<GoogleRedirect />} />
          <Route path="/set-password-google" element={<SetPasswordGoogle />} />
          {/* <Route
            path="/patient-profile/:uniqueId"
            element={<PatientProfilePage />}
          /> */}
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;