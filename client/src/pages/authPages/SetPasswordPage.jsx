import React from "react";

const SetPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen pb-20 bg-teal-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">
        Create Password
        </h2>

        <form className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-black mb-1">
               Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-black mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-teal-500 text-white py-2 mt-3 rounded-3xl flex items-center justify-center border-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;
