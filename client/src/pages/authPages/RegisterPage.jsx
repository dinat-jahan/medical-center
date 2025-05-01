import React from 'react';

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-teal-50 ">
      <div className="bg-teal-100 shadow-lg p-6 rounded-xl w-[700px]">
        <h2 className="text-4xl font-poetsen text-center mb-6 text-teal-500">Register</h2>

        {/* Login with Google */}
        <div className="text-center my-3">
          <a
            href="/auth/google"
            className="bg-teal-700 hover:bg-teal-400 text-white font-bold py-2 px-4 w-64 inline-block rounded-3xl text-center"
          >
            Login with Google
          </a>
        </div>

        <div className="text-center my-2 text-teal-400 text-semibold text-xl">OR</div>

        {/* Unique ID Login */}
        <form>
          <div className="mb-3">
            <label htmlFor="uniqueId" className="block text-2xl text-semibold text-teal-500 mb-1 text-center">
              Enter Your Unique ID
            </label>
            <input
              type="text"
              id="uniqueId"
              name="uniqueId"
              required
              className="w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="bg-teal-700 hover:bg-teal-400 text-white font-bold py-2 px-4 w-64 inline-block rounded-3xl text-center">
            Fetch Info
          </button>
        </form>

        {/* Static Member Info Preview */}
        <div className="mt-6">
          <h4 className="text-xl text-teal-500 font-semibold mb-2">Member Details Found:</h4>
          <p>
            <strong className='text-xl text-teal-500 font-semibold'>Name:</strong> <span>John Doe</span>
          </p>
          <p>
            <strong className='text-xl text-teal-500 font-semibold'>Department:</strong> <span>CSE</span>
          </p>
          <p>
            <strong className='text-xl text-teal-500 font-semibold'>Designation:</strong> <span>Lecturer</span>
          </p>
          <p>
            <strong className='text-xl text-teal-500 font-semibold'>Phone:</strong> <span>0123456789</span>
          </p>

          <div className="mb-3 mt-3">
            <label htmlFor="emailSelect" className="block font-medium mb-1 text-2xl text-teal-500 font-semibold">
              Select email to receive OTP:
            </label>
            <select
              id="emailSelect"
              className="w-full px-3 py-2 border rounded-3xl"
            >
              <option value="example1@mbstu.ac.bd">example1@mbstu.ac.bd</option>
              <option value="example2@mbstu.ac.bd">example2@mbstu.ac.bd</option>
            </select>
          </div>

          <button
            className="bg-teal-400 hover:bg-teal-900 text-white py-2 w-64 rounded-3xl mt-3"
          >
            Send OTP
          </button>

          {/* Static OTP input */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-64 px-3 py-2 border rounded-md mb-2"
            />
            <button
              className="bg-teal-600 hover:bg-teal-800 text-white py-2 w-64 rounded-3xl"
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
