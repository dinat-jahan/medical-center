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
  // console.log(selectedDate, selectedDoctor);
  //function to handle booking a slot
  const handleBooking = (slotId) => {
    axios
      .post(`/booking/book/${slotId}`, { patientId: patient.id })
      .then((res) => {
        const updatedSlot = res.data.slot;
        // Get the updated slot from backend response
        console.log(updatedSlot);
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot._id === slotId
              ? {
                  ...slot,
                  status: "unavailable",
                  bookingStatus: "booked",
                  bookedBy: updatedSlot.bookedBy, // Update bookedBy with new patient data
                }
              : slot
          )
        );
      })
      .catch((err) => console.log("booking err", err));
  };

  //function to handle canceling a booking
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
    <div>
      <PatientInfoCard patient={patient} />
      <BookingForm
        doctors={doctors}
        setDoctors={setDoctors}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
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
  );
};

export default BookingPage;
