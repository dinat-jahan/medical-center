import React, { useState, useEffect } from 'react';
import {
  FaUserCircle, FaPhoneAlt, FaBirthdayCake, FaEnvelope, FaUniversity,
  FaBuilding, FaUserTag, FaTint, FaEdit, FaCamera
} from 'react-icons/fa';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const dummyUser = {
      name: "Taslima Khatun",
      phone: "0123456789",
      dob: "2000-11-12",
      emails: ["it20006@mbstu.ac.bd"],
      userType: "student",
      department: "ICT",
      hall: "Bangamata Sheikh Fojilatunnesa Mujib Hall",
      session: "2019-20",
      designation: "Lecturer",
      office: "",
      role: "patient",
      bloodGroup: "AB+",
    };
    setUser(dummyUser);
    setEditedUser(dummyUser);
  }, []);

  const handleChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setUser(editedUser);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditMode(false);
  };

  if (!user) return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;

  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f0fdfa] py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl relative">

        {/* Edit Button */}
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="absolute top-4 right-4 bg-white px-2 py-1 text-sm text-teal-600 hover:text-teal-800 rounded-md shadow border border-teal-100 flex items-center gap-1 border-none w-[60px]"
          >
            <FaEdit className="text-xs" /> Edit
          </button>
        )}

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
          {editMode && (
            <label className="absolute bottom-0 right-[calc(50%-35px)] p-1 rounded-full cursor-pointer">
              <FaCamera className="text-teal-600 text-xs" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Name & Role */}
        <h2 className="text-3xl font-bold text-center mb-1 text-gray-800">{user.name}</h2>
        <p className="text-center text-sm text-gray-500 capitalize mb-6">{user.role}</p>

        {/* Info Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <EditableField icon={<FaPhoneAlt />} label="Phone" field="phone" value={editedUser.phone} onChange={handleChange} editMode={editMode} />
          <EditableField icon={<FaBirthdayCake />} label="Date of Birth" field="dob" value={editedUser.dob} onChange={handleChange} editMode={editMode} />
          <EditableField icon={<FaEnvelope />} label="Email" field="emails" value={editedUser.emails.join(', ')} onChange={(f, val) => handleChange(f, val.split(',').map(e => e.trim()))} editMode={editMode} />
          <EditableField icon={<FaTint />} label="Blood Group" field="bloodGroup" value={editedUser.bloodGroup} onChange={handleChange} editMode={editMode} />

          {user.userType === 'student' && (
            <>
              <EditableField icon={<FaUniversity />} label="Department" field="department" value={editedUser.department} onChange={handleChange} editMode={editMode} />
              <EditableField icon={<FaBuilding />} label="Hall" field="hall" value={editedUser.hall} onChange={handleChange} editMode={editMode} />
              <EditableField icon={<FaUserTag />} label="Session" field="session" value={editedUser.session} onChange={handleChange} editMode={editMode} />
            </>
          )}

          {user.userType === 'teacher' && (
            <>
              <EditableField icon={<FaUniversity />} label="Department" field="department" value={editedUser.department} onChange={handleChange} editMode={editMode} />
              <EditableField icon={<FaUserTag />} label="Designation" field="designation" value={editedUser.designation} onChange={handleChange} editMode={editMode} />
            </>
          )}

          {user.userType === 'staff' && (
            <>
              <EditableField icon={<FaBuilding />} label="Office" field="office" value={editedUser.office || 'N/A'} onChange={handleChange} editMode={editMode} />
              <EditableField icon={<FaUserTag />} label="Designation" field="designation" value={editedUser.designation} onChange={handleChange} editMode={editMode} />
            </>
          )}
        </div>

        {/* Save / Cancel Buttons */}
        {editMode && (
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={handleSave} className="bg-teal-500 text-white px-6 py-2 rounded-2xl hover:bg-teal-600 border-none">
              Save
            </button>
            <button onClick={handleCancel} className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600 border-none">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EditableField = ({ icon, label, value, field, onChange, editMode }) => (
  <div className="flex items-start gap-3 bg-teal-50 p-3 rounded-xl">
    <div className="text-teal-500 text-lg mt-1">{icon}</div>
    <div className="w-full">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {editMode ? (
        <input
          type="text"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
        />
      ) : (
        <p className="text-base font-semibold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default ProfilePage;
