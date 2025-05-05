import React, { useState, useEffect } from 'react';
import {
  FaUserCircle, FaPhoneAlt, FaBirthdayCake, FaEnvelope, FaUniversity,
  FaBuilding, FaUserTag, FaTint, FaIdBadge
} from 'react-icons/fa';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const dummyUser = {
      uniqueId: "IT20006",
      name: "Taslima Khatun",
      userType: "student", // Try changing to 'Staff' or 'Student' to test
      department: "ICT",
      program: "undergraduate",
      office: "Academic Section",
      designation: "Lecturer", // Change this to test 'Lecturer' hiding for staff
      designation_2: "Advisor",
      hall: "Bangamata Sheikh Fojilatunnesa Mujib Hall",
      session: "2019-20",
      bloodGroup: "AB+",
      dob: "2000-11-12",
      emails: ["it20006@mbstu.ac.bd"],
      phone: "0123456789",
      photo: "",
      role: "patient",
    };
    setUser(dummyUser);
    if (dummyUser.photo) {
      setProfileImage(dummyUser.photo);
    }
  }, []);

  if (!user) return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;

  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f0fdfa] py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl relative">

        {/* Profile Image */}
        <div className="relative flex justify-center mb-6">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-teal-600 text-7xl" />
          )}
        </div>

        {/* Name & Role */}
        <h2 className="text-3xl font-bold text-center mb-1 text-gray-800">{user.name}</h2>
        <p className="text-center text-sm text-gray-500 capitalize mb-6">{user.role}</p>

        {/* Info Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <InfoField icon={<FaIdBadge />} label="Unique ID" value={user.uniqueId} />
          <InfoField icon={<FaIdBadge />} label="Category" value={user.userType} />
          <InfoField icon={<FaBirthdayCake />} label="Date of Birth" value={user.dob} />
          <InfoField icon={<FaTint />} label="Blood Group" value={user.bloodGroup} />

          {user.userType === 'student' && (
            <>
              <InfoField icon={<FaUniversity />} label="Department" value={user.department} />
              <InfoField icon={<FaBuilding />} label="Hall" value={user.hall} />
              <InfoField icon={<FaUserTag />} label="Session" value={user.session} />
              <InfoField icon={<FaUniversity />} label="Program" value={user.program} />
            </>
          )}

          {user.userType === 'teacher' && (
            <>
              <InfoField icon={<FaUniversity />} label="Department" value={user.department || 'Not Provided'} />
              {user.designation && (
                <InfoField icon={<FaUserTag />} label="Designation" value={user.designation} />
              )}
              <InfoField icon={<FaUserTag />} label="Secondary Title" value={user.designation_2 || 'Not Provided'} />
            </>
          )}

          {user.userType === 'staff' && (
            <>
              <InfoField icon={<FaBuilding />} label="Office" value={user.office || 'N/A'} />
              {user.designation && (
                <InfoField
                  icon={<FaUserTag />}
                  label="Designation"
                  value={user.designation !== 'Lecturer' ? user.designation : 'N/A'}
                />
              )}
              <InfoField icon={<FaUserTag />} label="Secondary Title" value={user.designation_2 || 'N/A'} />
            </>
          )}

          {/* Contact Info */}
          <InfoField icon={<FaPhoneAlt />} label="Phone" value={user.phone} />
          <InfoField icon={<FaEnvelope />} label="Email" value={user.emails.join(', ')} />
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 bg-teal-50 p-3 rounded-xl">
    <div className="text-teal-500 text-lg mt-1">{icon}</div>
    <div className="w-full">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
