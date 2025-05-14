import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import axios from "axios";
import PatientInfoCard from "./component/PatientInfoCard";
import BookingForm from "./component/BookingForm";
import TimeSlotTable from "./component/TimeSlotTable";

const BookingPage = () => {
  const { user } = useContext(UserContext);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const patient = user;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/booking/doctors").then((res) => setDoctors(res.data.doctors));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (selectedDate && selectedDoctor) {
      axios
        .get(`/booking/slots?doctor=${selectedDoctor}&date=${selectedDate}`)
        .then((res) => {
          console.log(res.data);
          setSlots(res.data);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedDoctor, selectedDate]);

  const handleBooking = (slotId) => {
    axios
      .post(`/booking/book/${slotId}`, { patientId: patient.id })
      .then((res) => {
        const updatedSlot = res.data.slot;
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot._id === slotId
              ? {
                  ...slot,
                  status: "unavailable",
                  bookingStatus: "booked",
                  bookedBy: updatedSlot.bookedBy,
                }
              : slot
          )
        );
      })
      .catch((err) => console.log("booking err", err));
  };

  const handleCancel = (slotId) => {
    axios
      .post(`/booking/cancel/${slotId}`, { patientId: patient.id })
      .then((res) => {
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot._id === slotId
              ? {
                  ...slot,
                  status: "available",
                  bookingStatus: "",
                  bookedBy: null,
                }
              : slot
          )
        );
      })
      .catch((err) => console.log("cancellation err", err));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 bg-white-50">
      {/* Patient Info */}
      <div className="bg-teal-50 rounded-2xl shadow p-4">
        <h2 className="text-xl font-bold mb-2 text-teal-700">Patient Information</h2>
        <PatientInfoCard patient={patient} />
      </div>

      {/* Booking Form */}
      <div className="bg-teal-50 rounded-2xl shadow p-4">
        <h2 className="text-xl font-bold mb-2 text-teal-700">Book an Appointment</h2>
        <BookingForm
          doctors={doctors}
          setDoctors={setDoctors}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Slot Table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-bold mb-2 text-teal-700">Available Slots</h2>
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <TimeSlotTable
            slots={slots}
            patient={patient}
            handleBooking={handleBooking}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default BookingPage;
