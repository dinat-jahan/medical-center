import React, { useEffect, useState } from "react";
import axios from "axios";

const MedicalStaffPage = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get("/api/medical-staff");
        setStaff(res.data.staff);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching medical staff:", error);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-[#1e3a8a] mb-10">
        Our Medical Staff
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {staff.map((member) => (
          <div
            key={member._id}
            className="bg-white shadow rounded-2xl overflow-hidden transition hover:shadow-lg border"
          >
            <img
              className="w-full h-60 object-cover"
              src={member.photoUrl}
              alt={member.name}
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#0f766e] mb-1">
                {member.name}
              </h3>

              <p className="text-sm text-gray-700">{member.designation}</p>
              <p className="text-sm text-gray-700">{member.office}</p>
              <p className="text-sm text-gray-700">
                Mawlana Bhashani Science and Technology University
              </p>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Phone:</span> {member.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {member.emails?.[0] || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Blood Group:</span>{" "}
                  {member.bloodGroup}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalStaffPage;
