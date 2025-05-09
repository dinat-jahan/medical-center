import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/api/doctors");

        setDoctors(res.data.doctors);
        console.log(res.data);
        // setProfileImage(res.data.photoUrl);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-[#2B2D42] mb-10">
        Our Doctors
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white shadow rounded-2xl overflow-hidden transition hover:shadow-lg border"
          >
            <img
              className="w-full h-60 object-cover"
              src={doctor.photoUrl}
              alt={doctor.name}
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#0e7660] mb-1">
                {doctor.name}
              </h3>
              <p className="text-sm text-gray-700">MBBS</p>
              <p className="text-sm text-gray-700">{doctor.designation_2}</p>
              <p className="text-sm text-gray-700">{doctor.office}</p>
              <p className="text-sm text-gray-700">
                Mawlana Bhashani Science and Technology University
              </p>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Phone:</span> {doctor.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {doctor.emails?.[0]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
