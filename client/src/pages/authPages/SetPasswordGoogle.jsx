import React, { useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const SetPasswordGoogle = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/auth/set-password-google", {
        uniqueId: user?.uniqueId,
        password: password,
      });
      if (res.data.success) {
        setSuccessMessage("Password set successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setErrorMessage("Something went wrong");
      }
    } catch (error) {
      console.log("Set password error:", error);
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pb-20 bg-teal-50">
      <p className="text-sm text-gray-600 text-center mb-4">
        🎉 Welcome! You're a verified university member. Please set a password
        for your Medical Center account so you can log in directly next time.
      </p>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">
          Set Password
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-black mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-black mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-teal-500 text-white py-2 mt-3 rounded-3xl flex items-center justify-center border-none"
          >
            Submit
          </button>
        </form>
        {successMessage && (
          <p className="text-green-500 mt-4">{successMessage}</p>
        )}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SetPasswordGoogle;
