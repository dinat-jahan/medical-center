import { Link, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import Layout from "./Layout";
import ServicePage from "./pages/commonPages/servicePages.jsx/ServicePage";
import DoctorsPage from "./pages/commonPages/DoctorsPage";
import MedicalStaffsPage from "./pages/commonPages/MedicalStaffsPage";
import ContactPage from "./pages/commonPages/ContactPage";
import AddMember from "./pages/universityAdminPages/AddMember";
import RegisterPage from "./pages/authPages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SetPasswordPage from "./pages/authPages/SetPasswordPage";
import { UserContextProvider } from "./UserContext";
import axios from "axios";
import AvailableMedicine from "./pages/AvailableMedicine";
import PrivateRoute from "./PrivateRoute";
import AccessDenied from "./AccessDeniedPage";
import AboutPage from "./pages/commonPages/AboutPage";
import GoogleRedirect from "./pages/authPages/GoogleRedirectPage";
import SetPasswordGoogle from "./pages/authPages/SetPasswordGoogle";
import PatientProfilePage from "./pages/doctorPages/PatientProfilePage";
import WritePrescription from "./pages/doctorPages/WritePrescriptionPage";
import ShowPrescriptionPage from "./pages/doctorPages/ShowPrescriptionPage";
import SearchMedicinesPage from "./pages/doctorPages/SearchMedicinesPage";
import ManageMedicinePage from "./pages/medicalStaffPages/ManageMedicinePage";
import MedicineOutOfStockPage from "./pages/medicalStaffPages/MedicineOutOfStockPage";
import TelemedicinePage from "./pages/commonPages/TelemedicinePage";
import BookingPage from "./pages/bookingPages/BookingPage";
import SearchMedicines2Page from "./pages/doctorPages/SearchMedicines2Page";
import ManageDutyRosterDoctor from "./pages/medicalAdminPages/ManageDutyRosterDoctor";
import PrescriptionForm from "./pages/doctorPages/prescriptionPage/PrescriptionForm";
import PrescriptionView from "./pages/doctorPages/prescriptionPage/PrescriptionView";
import PrescriptionHistory from "./pages/patientPages/prescriptionPages/PrescriptionHistory";
import DutyRosterOfDoctorsPage from "./pages/DutyRosterOfDoctorsPage";
import DispenseMedicine from "./pages/medicalStaffPages/DispenseMedicine";
import EditMedicinePage from "./pages/medicalStaffPages/EditMedicinePage";
import MedicineView from "./pages/doctorPages/MedicineView";
import DoctorMedicineDetailPage from "./pages/doctorPages/MedicineDetail";
import StaffMedicineDetailPage from "./pages/medicalStaffPages/MedicineDetail";
import ForgotPasswordPage from "./pages/authPages/ForgotPasswordPage";
import ManageStaffDutyRoster from "./pages/medicalAdminPages/ManageStaffDutyRoster";
import TelemedicineDuty from "./pages/medicalAdminPages/TelemedicineDuty";
import AmbulanceAssignmentPage from "./pages/medicalAdminPages/AmbulanceAssignmentPage";
import DutyRosterViewer from "./pages/commonPages/DutyRosterViewer";
axios.defaults.baseURL = import.meta.env.DEV
  ? "http://localhost:2000"
  : import.meta.env.VITE_API_BASE_URL;

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
          <Route path="/doctor/available-medicine" element={<MedicineView />} />
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
          <Route
            path="/patient-profile/:uniqueId"
            element={<PatientProfilePage />}
          />
          <Route path="/write-prescription" element={<WritePrescription />} />
          <Route
            path="/medical-staff/manage-medicine"
            element={<ManageMedicinePage />}
          />
          <Route
            path="/medical-staff/medicine-out-of-stock"
            element={<MedicineOutOfStockPage />}
          />
          <Route path="/show-prescription" element={<ShowPrescriptionPage />} />
          <Route
            path="/duty-roster-of-doctors"
            element={<DutyRosterOfDoctorsPage />}
          />
          <Route path="/search-medicine" element={<SearchMedicinesPage />} />
          <Route path="/telemedicine" element={<TelemedicinePage />} />
          <Route
            path="/search-medicine/:medicineId"
            element={<SearchMedicinesPage />}
          />
          <Route
            path="/search-medicine/:medicineSearch"
            element={<SearchMedicines2Page />}
          />
          <Route
            path="/medical-admin/manage-duty-roster-doctor"
            element={<ManageDutyRosterDoctor />}
          />
          <Route path="/search-medicine" element={<SearchMedicinesPage />} />
          <Route path="/telemedicine" element={<TelemedicinePage />} />
          <Route path="/book-appointment" element={<BookingPage />} />
          <Route
            path="/write-prescription/:uniqueId"
            element={<PrescriptionForm />}
          />
          <Route
            path="/show-prescription/:prescriptionId"
            element={<PrescriptionView />}
          />
          <Route
            path="/patient/medical-history"
            element={<PrescriptionHistory />}
          />
          <Route
            path="/medical-staff/pending-medicine-requests"
            element={<DispenseMedicine />}
          />
          <Route
            path="/medical-staff/medicines/:id"
            element={<StaffMedicineDetailPage />}
          />{" "}
          <Route
            path="/doctor/medicines/:id"
            element={<DoctorMedicineDetailPage />}
          />
          <Route path="/medicines/:id/edit" element={<EditMedicinePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/medical-admin/manage-medical-staff"
            element={<ManageStaffDutyRoster />}
          />
          <Route
            path="/medical-admin/telemedicine-duty"
            element={<TelemedicineDuty />}
          />

          <Route path="/doctor/write-prescription" element={<WritePrescription />} />

          <Route
            path="/medical-admin/set-driver"
            element={<AmbulanceAssignmentPage />}
          />
          <Route path="/duty-roster-staff" element={<DutyRosterViewer />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
