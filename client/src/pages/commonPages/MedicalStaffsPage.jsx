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

  const renderGroup = (title, filterFn) => {
    const groupMembers = staff.filter(filterFn);

    if (groupMembers.length === 0) return null;

    return (
      <section className="mb-20 border-b border-teal-200 pb-10 last:border-0 last:pb-0">
        <h2 className="text-3xl font-poetsen text-center text-teal-500 mb-8">
          {title}
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {groupMembers.map((member) => (
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
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-teal-50 px-4 py-10">
      {/* Office Attendant Group */}
      {renderGroup(
        "Office Attendant",
        (member) =>
          member.designation?.toLowerCase() === "office attendant"
      )}

      {/* Nurse and Brother Group (including Senior Nurse and Brother) */}
      {renderGroup(
        "Nurse and Brother",
        (member) =>
          [
            "nurse",
            "brother",
            "senior nurse",
            "senior brother",
            "nurse and brother",
          ].includes(member.designation?.toLowerCase())
      )}

      {/* Assistant Technical Officer Group */}
      {renderGroup(
        "Assistant Technical Officer",
        (member) =>
          member.designation?.toLowerCase() === "assistant technical officer"
      )}

      {/* Other Medical Staffs */}
      {renderGroup(
        "Other Medical Staffs",
        (member) =>
          ![
            "nurse",
            "brother",
            "senior nurse",
            "senior brother",
            "nurse and brother",
            "office attendant",
            "assistant technical officer",
          ].includes(member.designation?.toLowerCase())
      )}
    </div>
  );
};

export default MedicalStaffPage;
