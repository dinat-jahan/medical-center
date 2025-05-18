// BookingPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import axios from "axios";
import PatientInfoCard from "./component/PatientInfoCard";
import BookingForm from "./component/BookingForm";
import TimeSlotTable from "./component/TimeSlotTable";
import ErrorModal from "./component/ErrorModal";

const BookingPage = () => {
  const { user } = useContext(UserContext);
  const isDoctor = user.role === "doctor";
  const isStaff = user.role === "medical-staff";
  const isAdmin = user.role === "medical-admin";
  const isPatient = user.role === "patient";

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(isDoctor ? user.id : "");
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dayOffMessage, setDayOffMessage] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch slots when date or doctor changes
  useEffect(() => {
    // if no date, or (if not doctor and no doctor selected) → bail
    if (!selectedDate || (!isDoctor && !selectedDoctor)) return;

    setLoading(true);
    const doctorId = isDoctor ? user.id : selectedDoctor;

    axios
      .get(`/booking/slots?doctor=${doctorId}&date=${selectedDate}`)
      .then((res) => {
        if (res.data.message) {
          setDayOffMessage(res.data.message);
          setSlots([]);
        } else {
          setDayOffMessage("");
          // handle both { slots: [...] } shape or direct array
          setSlots(res.data.slots ?? res.data);
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        setErrorMessage(msg);
        setShowErrorModal(true);
      })
      .finally(() => setLoading(false));
  }, [selectedDate, selectedDoctor, isDoctor, user.id]);

  // Patient books a slot
  const handleBooking = (slotId) => {
    setErrorMessage("");
    axios
      .post(`/booking/book/${slotId}`, {
        patientId: user.id,
        date: selectedDate,
      })
      .then((res) => {
        setSlots((prev) =>
          prev.map((s) => (s._id === slotId ? res.data.slot : s))
        );
        // Clear any previous errors on successful booking
        setErrorMessage("");
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        setErrorMessage(msg);
        setShowErrorModal(true);
      });
  };

  // Patient cancels a booking
  const handleCancel = (slotId) => {
    axios
      .post(`/booking/cancel/${slotId}`, { patientId: user.id })
      .then((res) => {
        setSlots((prev) =>
          prev.map((s) => (s._id === slotId ? res.data.slot : s))
        );
        setErrorMessage("");
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        setErrorMessage(msg);
        setShowErrorModal(true);
      });
  };

  // Admin marks a single slot unavailable
  const handleMakeUnavailable = (slotId) => {
    axios
      .post(`/booking/unavailable/${slotId}`)
      .then((res) =>
        setSlots((prev) =>
          prev.map((s) => (s._id === slotId ? res.data.slot : s))
        )
      )
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        setErrorMessage(msg);
        setShowErrorModal(true);
      });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 bg-teal-50">
      {/* Info Card */}
      <div className="p-3 bg-white rounded">
        <h2 className="text-xl font-bold text-teal-700">
          {isDoctor && "Doctor Information"}
          {isStaff && "Medical Staff Information"}
          {isAdmin && "Admin Information"}
          {isPatient && "Patient Information"}
        </h2>
        <PatientInfoCard patient={user} />
      </div>

      {/* Booking/Form Section */}
      <div className="p-3 bg-white rounded">
        <h2 className="text-xl font-bold text-teal-700">
          {isPatient ? "Book an Appointment" : "View Bookings"}
        </h2>
        <BookingForm
          showDoctorSelect={!isDoctor}
          doctors={doctors}
          setDoctors={setDoctors}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isAdmin={isAdmin}
        />
      </div>

      {/* Slots Table */}
      <div className="p-3 bg-white rounded">
        <h2 className="text-xl font-bold text-teal-700">Available Slots</h2>
        {dayOffMessage && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
            {dayOffMessage}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : slots.length === 0 ? (
          <p className="py-4 text-center text-gray-500">
            {isDoctor
              ? `No slots – you’re not on duty ${selectedDate}`
              : `Select date and doctor to view slots`}
          </p>
        ) : (
          <TimeSlotTable
            slots={slots}
            user={user}
            isDoctor={isDoctor}
            isStaff={isStaff}
            isAdmin={isAdmin}
            isPatient={isPatient}
            handleBooking={handleBooking}
            handleCancel={handleCancel}
            handleMakeUnavailable={handleMakeUnavailable}
          />
        )}
        {/* Error Modal */}
        <ErrorModal
          message={errorMessage}
          show={showErrorModal}
          onClose={() => {
            setShowErrorModal(false);
            setErrorMessage("");
          }}
        />
      </div>
    </div>
  );
};

export default BookingPage;
