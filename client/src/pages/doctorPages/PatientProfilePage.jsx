import React, { useState, useEffect, useContext } from "react";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaBirthdayCake,
  FaEnvelope,
  FaUniversity,
  FaBuilding,
  FaUserTag,
  FaTint,
  FaIdBadge,
} from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { InfoField } from "../../components/InfoField";
const PatientProfilePage = () => {
  const { uniqueId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/doctor/patient-profile/${uniqueId}`);
        console.log(data);
        if (data.success) {
          setUserInfo(data.user);
          if (data.user.photoUrl) setProfileImage(data.user.photoUrl);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (uniqueId) {
      fetchProfile();
    }
  }, [uniqueId]);
  if (loading) return <div>Loading...</div>;
  const capitalizeFirst = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  if (!userInfo)
    return (
      <div className="text-center mt-20 text-gray-500">No patient found.</div>
    );
  const dateOfBirth = new Date(userInfo.dob);
  const formattedDate =
    dateOfBirth instanceof Date && !isNaN(dateOfBirth)
      ? dateOfBirth.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Invalid Date";

  const handleWritePrescription = () => {
    // navigate to prescription form, passing patientId via URL
    navigate(`/write-prescription/${uniqueId}`);
  };
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
        <h2 className="text-3xl font-bold text-center mb-1 text-gray-800">
          {userInfo.name}
        </h2>
        <p className="text-center text-sm text-gray-500 capitalize mb-6">
          {userInfo.role}
        </p>

        {/* Info Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <InfoField
            icon={<FaIdBadge />}
            label="Unique ID"
            value={userInfo.uniqueId.toUpperCase()}
          />
          <InfoField
            icon={<FaIdBadge />}
            label="Category"
            value={capitalizeFirst(userInfo.userType)}
          />
          <InfoField
            icon={<FaBirthdayCake />}
            label="Date of Birth"
            value={formattedDate}
          />
          <InfoField
            icon={<FaTint />}
            label="Blood Group"
            value={userInfo.bloodGroup}
          />

          {userInfo.userType === "student" && (
            <>
              <InfoField
                icon={<FaUniversity />}
                label="Department"
                value={userInfo.department}
              />
              <InfoField
                icon={<FaBuilding />}
                label="Hall"
                value={userInfo.hall}
              />
              <InfoField
                icon={<FaUserTag />}
                label="Session"
                value={userInfo.session}
              />
              <InfoField
                icon={<FaUniversity />}
                label="Program"
                value={capitalizeFirst(userInfo.program)}
              />
            </>
          )}

          {userInfo.userType === "teacher" && (
            <>
              <InfoField
                icon={<FaUniversity />}
                label="Department"
                value={userInfo.department || "Not Provided"}
              />
              {user.designation && (
                <InfoField
                  icon={<FaUserTag />}
                  label="Designation"
                  value={userInfo.designation}
                />
              )}
              <InfoField
                icon={<FaUserTag />}
                label="Secondary Title"
                value={userInfo.designation_2 || "Not Provided"}
              />
            </>
          )}

          {userInfo.userType === "staff" && (
            <>
              <InfoField
                icon={<FaBuilding />}
                label="Office"
                value={userInfo.office || "N/A"}
              />
              {userInfo.designation && (
                <InfoField
                  icon={<FaUserTag />}
                  label="Designation"
                  value={userInfo.designation || "N/A"}
                />
              )}
              <InfoField
                icon={<FaUserTag />}
                label="Secondary Title"
                value={userInfo.designation_2 || "N/A"}
              />
            </>
          )}

          {/* Contact Info */}
          <InfoField
            icon={<FaPhoneAlt />}
            label="Phone"
            value={userInfo.phone}
          />
          <InfoField
            icon={<FaEnvelope />}
            label="Email"
            value={
              Array.isArray(userInfo.emails)
                ? userInfo.emails.join(", ")
                : userInfo.emails
            }
          />
        </div>
        {/* Write Prescription Button */}
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 bg-teal-500 mr-9 text-white font-semibold rounded-xl hover:bg-teal-700"
            onClick={handleWritePrescription}
          >
            Write Prescription
          </button>
          <button
            className="px-6 py-2 bg-teal-600 ml-9 text-white font-semibold rounded-xl hover:bg-teal-700"
            onClick={() => {
              navigate(`/doctor/patient-history/${uniqueId}`);
            }}
          >
            View Medical History
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;
