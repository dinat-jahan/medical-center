import React from 'react';

const AddMember = () => {
  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 bg-teal-50 py-8 rounded-lg shadow-md space-x-4  pl-10 pr-5">
      <h2 className="text-4xl font-poetsen text-teal-500 text-center mb-8">Add University Member</h2>
      <form
        action="/admin/university/add-member"
        method="POST"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-10  "> 
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="uniqueId" className="block text-teal-700 font-semibold mb-1">Unique ID</label>
              <input
                type="text"
                name="uniqueId"
                id="uniqueId"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-teal-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label htmlFor="userType" className="block text-teal-700 font-semibold mb-1">User Type</label>
              <select
                name="userType"
                id="userType"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <label htmlFor="sex" className="block text-teal-700 font-semibold mb-1">Sex</label>
              <select
                name="sex"
                id="sex"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-teal-700 font-semibold mb-1">Department (if applicable)</label>
              <select
                name="department"
                id="department"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Department</option>
                <option>Computer Science and Engineering</option>
                <option>Information and Communication Technology</option>
                <option>Textile Engineering</option>
                <option>Mechanical Engineering</option>
                <option>Environmental Science and Resource Management</option>
                <option>Criminology and Police Science</option>
                <option>Food Technology and Nutritional Science</option>
                <option>Biotechnology and Genetic Engineering</option>
                <option>Biochemistry and Molecular Biology</option>
                <option>Pharmacy</option>
                <option>Physiotherapy Rehabilitation</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Statistics</option>
                <option>Business Administration</option>
                <option>Accounting</option>
                <option>Management</option>
                <option>Economics</option>
                <option>English</option>
              </select>
            </div>

            <div>
              <label htmlFor="office" className="block text-teal-700 font-semibold mb-1">Office (if applicable)</label>
              <input
                type="text"
                name="office"
                id="office"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
              <label htmlFor="hall" className="block text-teal-700 font-semibold mb-1">Hall (if applicable)</label>
              <select
                name="hall"
                id="hall"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Hall</option>
                <optgroup label="Men">
                  <option>Bangabandhu Sheikh Mujibur Rahman Hall</option>
                  <option>Shahid Ziaur Rahman Hall</option>
                  <option>Jananeta Abdul Mannan Hall</option>
                  <option>Sheikh Russel Hall</option>
                </optgroup>
                <optgroup label="Women">
                  <option>Alema Khatun Bhashani Hall</option>
                  <option>Shahid Janoni Jahanara Imam Hall</option>
                  <option>Bangamata Sheikh Fojilatunnesa Mujib Hall</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 gap-30 md:gap-x-20 pl-2 pr-10">


         
            <div>
              <label htmlFor="designation_2" className="block text-teal-700 font-semibold mb-1">Specific Designation</label>
              <input
                type="text"
                name="designation_2"
                id="designation_2"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
              <label htmlFor="session" className="block text-teal-700 font-semibold mb-1">Session (if student)</label>
              <input
                type="text"
                name="session"
                id="session"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
              <label htmlFor="bloodGroup" className="block text-teal-700 font-semibold mb-1">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                id="bloodGroup"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-teal-700 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                id="dob"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label htmlFor="emails" className="block text-teal-700 font-semibold mb-1">Emails (comma separated)</label>
              <input
                type="text"
                name="emails"
                id="emails"
                placeholder="email1@gmail.com, email2@gmail.com"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-teal-700 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label htmlFor="photo" className="block text-teal-700 font-semibold mb-1">Photo</label>
              <input
                type="file"
                name="photo"
                id="photo"
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
    </div>
  );
};

export default AddMember;
