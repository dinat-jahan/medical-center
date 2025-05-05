import { useState } from "react";
import axios from "axios";

const AddMember = () => {
  const [userType, setUserType] = useState("student"); // Default to student
  const [formData, setFormData] = useState({
    uniqueId: "",
    name: "",
    userType: "student",
    sex: "",
    department: "",
    office: "",
    hall: "",
    designation: "",
    designation_2: "",
    program: "",
    session: "",
    bloodGroup: "",
    dob: "",
    emails: "",
    phone: "",
    photo: null,
  });

  const [successMessage, setSuccessMessage] = useState(""); // To store success message
  const [errorMessage, setErrorMessage] = useState("");

  // Handle the change in user type to show/hide fields accordingly
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setFormData({ ...formData, userType: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = axios.post("/admin/university/add-member", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      // On success, show a success message
      setSuccessMessage("Member added successfully!");
      setErrorMessage(""); // Clear any previous error messages

      setFormData({
        uniqueId: "",
        name: "",
        userType: "student",
        sex: "",
        department: "",
        office: "",
        hall: "",
        designation: "",
        designation_2: "",
        program: "",
        session: "",
        bloodGroup: "",
        dob: "",
        emails: "",
        phone: "",
        photo: null,
      });
    } catch (err) {
      console.log(err);
      setErrorMessage(
        "An error occurred while adding the member. Please try again."
      );
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 bg-teal-50 py-8 rounded-lg shadow-md space-x-4 pl-10 pr-5">
      <h2 className="text-4xl font-poetsen text-teal-500 text-center mb-8">
        Add University Member
      </h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-10">
          <div className="space-y-4">
            {/* Unique ID */}
            <div>
              <label
                htmlFor="uniqueId"
                className="block text-teal-700 font-semibold mb-1"
              >
                Unique ID
              </label>
              <input
                type="text"
                name="uniqueId"
                id="uniqueId"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={formData.uniqueId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-teal-700 font-semibold mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* User Type */}
            <div>
              <label
                htmlFor="userType"
                className="block text-teal-700 font-semibold mb-1"
              >
                User Type
              </label>
              <select
                name="userType"
                id="userType"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={formData.userType}
                onChange={handleUserTypeChange} // Track userType change
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {/* Sex */}
            <div>
              <label
                htmlFor="sex"
                className="block text-teal-700 font-semibold mb-1"
              >
                Sex
              </label>
              <select
                name="sex"
                id="sex"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={formData.sex}
                onChange={handleChange}
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Department */}
            {userType !== "staff" && (
              <div>
                <label
                  htmlFor="department"
                  className="block text-teal-700 font-semibold mb-1"
                >
                  Department
                </label>
                <select
                  name="department"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Department</option>{" "}
                  {/* This is the placeholder */}
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information and Communication Technology">
                    Information and Communication Technology
                  </option>
                  <option value="Textile Engineering">
                    Textile Engineering
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Environmental Science and Resource Management">
                    Environmental Science and Resource Management
                  </option>
                  <option value="Criminology and Police Science">
                    Criminology and Police Science
                  </option>
                  <option value="Food Technology and Nutritional Science">
                    Food Technology and Nutritional Science
                  </option>
                  <option value="Biotechnology and Genetic Engineering">
                    Biotechnology and Genetic Engineering
                  </option>
                  <option value="Biochemistry and Molecular Biology">
                    Biochemistry and Molecular Biology
                  </option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Statistics">Statistics</option>
                  <option value="Business Administration">
                    Business Administration
                  </option>
                  <option value="Accounting">Accounting</option>
                  <option value="Management">Management</option>
                  <option value="Economics">Economics</option>
                  <option value="English">English</option>
                </select>
              </div>
            )}

            {/* Office */}
            {userType !== "student" && (
              <div>
                <label
                  htmlFor="office"
                  className="block text-teal-700 font-semibold mb-1"
                >
                  Office
                </label>
                <input
                  type="text"
                  name="office"
                  id="office"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                  value={formData.office}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Hall (for Students only) */}
            {userType === "student" && (
              <div>
                <label
                  htmlFor="hall"
                  className="block text-teal-700 font-semibold mb-1"
                >
                  Hall
                </label>
                <select
                  name="hall"
                  id="hall"
                  value={formData.hall}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Hall</option>{" "}
                  {/* This is the placeholder */}
                  <optgroup label="Men">
                    <option value="Bangabandhu Sheikh Mujibur Rahman Hall">
                      Bangabandhu Sheikh Mujibur Rahman Hall
                    </option>
                    <option value="Shahid Ziaur Rahman Hall">
                      Shahid Ziaur Rahman Hall
                    </option>
                    <option value="Jananeta Abdul Mannan Hall">
                      Jananeta Abdul Mannan Hall
                    </option>
                    <option value="Sheikh Russel Hall">
                      Sheikh Russel Hall
                    </option>
                  </optgroup>
                  <optgroup label="Women">
                    <option value="Alema Khatun Bhashani Hall">
                      Alema Khatun Bhashani Hall
                    </option>
                    <option value="Shahid Janoni Jahanara Imam Hall">
                      Shahid Janoni Jahanara Imam Hall
                    </option>
                    <option value="Bangamata Sheikh Fojilatunnesa Mujib Hall">
                      Bangamata Sheikh Fojilatunnesa Mujib Hall
                    </option>
                  </optgroup>
                </select>
              </div>
            )}

            {/* Designation (Teacher or Staff only) */}
            {(userType === "teacher" || userType === "staff") && (
              <div>
                <label
                  htmlFor="designation"
                  className="block text-teal-700 font-semibold mb-1"
                >
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  id="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
            {(userType === "teacher" || userType === "staff") && (
              <div>
                <label
                  htmlFor="designation_2"
                  className="block text-teal-700 font-semibold mb-1"
                >
                  Specific Designation
                </label>
                <input
                  type="text"
                  name="designation_2"
                  id="designation_2"
                  value={formData.designation_2}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 gap-30 md:gap-x-20 pl-2 pr-10">
            {/* Program */}
            {userType === "student" && (
              <div>
                <label
                  htmlFor="program"
                  className="block text-teal-700 font-semibold mb-1"
                >
                  Program
                </label>
                <select
                  name="program"
                  id="program"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                  value={formData.program}
                  onChange={handleChange}
                >
                  <option value="">Select Program</option>
                  <option value="graduate">Graduate</option>
                  <option value="undergraduate">Undergraduate</option>
                </select>
              </div>
            )}

            {/* Session (if student) */}
            {userType === "student" && (
              <div>
                <label
                  htmlFor="session"
                  className="block text-teal-700 font-semibold mb-1"
                >
                  Session
                </label>
                <input
                  type="text"
                  name="session"
                  id="session"
                  value={formData.session}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                />
              </div>
            )}

            {/* Blood Group */}
            <div>
              <label
                htmlFor="bloodGroup"
                className="block text-teal-700 font-semibold mb-1"
              >
                Blood Group
              </label>
              <input
                type="text"
                name="bloodGroup"
                id="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dob"
                className="block text-teal-700 font-semibold mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* Emails */}
            <div>
              <label
                htmlFor="emails"
                className="block text-teal-700 font-semibold mb-1"
              >
                Emails (comma separated)
              </label>
              <input
                type="text"
                name="emails"
                id="emails"
                value={formData.emails}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-teal-700 font-semibold mb-1"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* Photo */}
            <div>
              <label
                htmlFor="photo"
                className="block text-teal-700 font-semibold mb-1"
              >
                Photo
              </label>
              <input
                type="file"
                name="photo"
                id="photo"
                onChange={handleFileChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="w-[605px] bg-teal-500 hover:bg-sky-800 text-white font-bold py-3 px-6 rounded-full border border-black focus:outline-none focus:shadow-outline text-center"
          >
            Add Member
          </button>
        </div>
      </form>
      {successMessage && (
        <div className="text-green-500 text-center p-2 bg-green-100 mb-4 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="text-red-500 text-center p-2 bg-red-100 mb-4 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default AddMember;
