// === src/pages/ForgotPasswordPage.jsx ===
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";

const ForgotPasswordPage = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [step, setStep] = useState(1);
  const [emailForOtp, setEmailForOtp] = useState("");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [memberInfo, setMemberInfo] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 1: fetch member emails
  const handleFetch = async () => {
    setMessage("");
    if (!uniqueId.trim()) return setMessage("Enter your Unique ID.");
    try {
      const { data } = await api.get(
        `/forgot-password/fetch-member/${uniqueId}`
      );
      if (data.success) {
        setMemberInfo(data.member);
        if (data.member.emails.length > 0) {
          setEmailForOtp(data.member.emails[0]);
        }
        setStep(2);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Step 2: send OTP
  const handleSendOtp = async () => {
    setMessage("");
    try {
      const { data } = await api.post("/forgot-password/send-otp", {
        uniqueId,
        email: emailForOtp,
      });
      if (data.success) {
        setStep(3);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Step 3: verify OTP
  const handleVerifyOtp = async () => {
    setMessage("");
    if (!otp.trim()) return setMessage("Enter the OTP.");
    try {
      const { data } = await api.post("/forgot-password/verify-otp", {
        uniqueId,
        otp,
      });
      if (data.success) {
        setStep(4);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Step 4: reset password
  const handleReset = async () => {
    setMessage("");
    if (password.length < 6)
      return setMessage("Password must be at least 6 characters");
    if (password != confirmPassword) {
      setMessage("Password do not match");
      return;
    }
    try {
      const { data } = await api.post("/forgot-password/reset-password", {
        uniqueId,
        password,
      });
      if (data.success) {
        document.getElementById("login_modal").showModal();
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-6">
        {/* Step 1: get email */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold">Forgot Password</h2>
            <input
              type="text"
              placeholder="Enter Unique ID"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-teal-400"
            />
            <button
              onClick={handleFetch}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Next
            </button>
          </>
        )}

        {/* Step 2: send OTP */}
        {step === 2 && (
          <>
            <div className="w-[400px] mt-6">
              <label
                htmlFor="emailSelect"
                className="block font-medium text-teal-600 mb-1"
              >
                Select email to receive OTP:
              </label>
              <select
                id="emailSelect"
                className="w-full px-3 py-2 border rounded-3xl text-center"
                value={emailForOtp}
                onChange={(e) => setEmailForOtp(e.target.value)}
              >
                {memberInfo.emails.map((email) => (
                  <option value={email} key={email}>
                    {email}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 3: verify OTP */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-teal-400"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 4: reset password */}
        {step === 4 && (
          <>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black mb-1"
              >
                Enter new Password
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
              onClick={handleReset}
              className="w-full py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
            >
              Reset Password
            </button>
          </>
        )}

        {message && (
          <p className="text-red-500 text-sm text-center">{message}</p>
        )}

        <div className="text-center text-gray-600 pt-4">
          <Link
            onClick={() => {
              document.getElementById("login_modal").showModal();
            }}
            className="text-primary hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
