export const roleMenus = {
  patient: [
    { name: "Profile", path: "/profile" },
    { name: "Medical History", path: "/patient/medical-history" },
    { name: "Book appointment", path: "/book-appointment" },
  ],
  doctor: [
    { name: "Profile", path: "/profile" },
    { name: "Available Medicines", path: "/doctor/available-medicine" },

    { name: "View Booking Info", path: "/book-appointment" },
  ],
  "medical-staff": [
    { name: "Profile", path: "/profile" },
    { name: "Available Medicine", path: "/medical-staff/manage-medicine" },
    {
      name: "Pending Medicine Requests",
      path: "/medical-staff/pending-medicine-requests",
    },
    {
      name: "Medicine Out of Stock",
      path: "/medical-staff/medicine-out-of-stock",
    },
  ],
  "university-admin": [
    { name: "Add university member", path: "/university-admin/add-member" },
  ],
  "medical-admin": [
    {
      name: "Edit Doctor List",
      path: "/medical-admin/manage-duty-roster-doctor",
    },
    {
      name: "Manage Medical Staff",
      path: "/medical-admin/manage-medical-staff",
    },
    {
      name: "Manage Telemedicine",
      path: "/medical-admin/telemedicine-duty",
    },
    { name: "View Booking Info", path: "/book-appointment" },
    {
      name: "Manage Ambulance",
      path: "/medical-admin/set-driver",
    },
  ],
};
