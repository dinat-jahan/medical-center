import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const SetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const uniqueId = params.get("uniqueId");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    if (password != confirmPassword) {
      setErrorMessage("Password do not match");
      return;
    }

    try {
      console.log(uniqueId, password);
      const response = await axios.post("/auth/save-user-password", {
        uniqueId,
        password,
      });
      console.log(response);
      if (response.data.success) {
        setSuccessMessage("Password set successfully. You can now log in");
        document.getElementById("login_modal").showModal();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Error setting password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pb-20 bg-teal-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">
          Create Password
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

export default SetPasswordPage;
