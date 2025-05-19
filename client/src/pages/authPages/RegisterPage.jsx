// === src/pages/RegisterPage.jsx ===
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [uniqueId, setUniqueId] = useState("");
  const [memberInfo, setMemberInfo] = useState(null);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendURL = import.meta.env.DEV
    ? "http://localhost:2000"
    : import.meta.env.VITE_API_BASE_URL;

  const getStepMargin = () => {
    if (step === 2) return "mt-8";
    if (step === 1 || step === 3) return "mt-20";
    return "";
  };

  const fetchMemberInfo = async () => {
    setErrorMessage("");
    if (!uniqueId.trim()) {
      setErrorMessage("Please enter your Unique ID.");
      return;
    }
    setIsFetching(true);
    try {
      const { data } = await api.get(`/fetch-member/${uniqueId}`);
      if (data.success) {
        setMemberInfo(data.member);
        if (data.member.emails.length > 0) {
          setEmailForOtp(data.member.emails[0]);
        }
        setStep(2);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage(`Fetch failed: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const sendOtp = async () => {
    setErrorMessage("");
    if (!emailForOtp) {
      setErrorMessage("Please select an email.");
      return;
    }
    try {
      const { data } = await api.post("/send-otp", { uniqueId, emailForOtp });
      if (data.success) {
        setSuccessMessage(data.message);
        setStep(3);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage(`Error sending OTP: ${err.message}`);
    }
  };

  const verifyOtp = async () => {
    setErrorMessage("");
    if (!otp.trim()) {
      setErrorMessage("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/verify-otp", { uniqueId, otp });
      if (data.success) {
        setSuccessMessage(data.message);
        navigate(`/set-password?uniqueId=${uniqueId}`);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage(`Error verifying OTP: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const dateOfBirth = new Date(memberInfo?.dob);
  const formattedDate =
    dateOfBirth instanceof Date && !isNaN(dateOfBirth)
      ? dateOfBirth.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Invalid Date";

  return (
    <div className="flex justify-center items-start min-h-screen bg-teal-50">
      <div className={`bg-white shadow-lg p-8 rounded-xl ${getStepMargin()}`}>
        <h2 className="text-4xl font-bold text-teal-500 text-center mb-6">
          Register
        </h2>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="flex justify-center mb-4">
              <a
                href={`${backendURL}/auth/google`}
                className="w-[400px] bg-violet-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-3xl flex items-center justify-center gap-2"
              >
                <FcGoogle className="text-2xl bg-white rounded-full" />
                Login with Google
              </a>
            </div>
            <div className="flex flex-col items-center mb-4">
              <input
                type="text"
                placeholder="Enter Your Unique ID"
                className="w-[400px] px-4 py-2 border rounded-3xl text-center mb-4"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
              />
              <button
                onClick={fetchMemberInfo}
                disabled={isFetching}
                className={`w-[400px] ${
                  isFetching
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-teal-500"
                } text-white py-2 mt-5 rounded-3xl`}
              >
                {isFetching ? "Loading…" : "Fetch Info"}
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && memberInfo && (
          <div className="flex flex-col items-center mt-4 text-left w-full">
            <h4 className="text-xl text-teal-500 font-semibold mb-4 w-[400px]">
              Member Details Found:
            </h4>
            <div className="w-[400px] space-y-2 text-black-700">
              <p>
                <strong>Name:</strong> {memberInfo.name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {formattedDate}
              </p>
              <p>
                <strong>Phone:</strong> {memberInfo.phone}
              </p>
              {(memberInfo.userType === "student" ||
                memberInfo.userType === "teacher") && (
                <p>
                  <strong>Department:</strong> {memberInfo.department}
                </p>
              )}
              {(memberInfo.userType === "teacher" ||
                memberInfo.userType === "staff") && (
                <p>
                  <strong>Designation:</strong> {memberInfo.designation}
                </p>
              )}
            </div>
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
            <div className="flex justify-center mt-6">
              <button
                onClick={sendOtp}
                className="w-[400px] bg-blue-500 hover:bg-teal-500 text-white py-2 mt-3 rounded-3xl"
              >
                Send OTP
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <input
              type="number"
              placeholder="Enter OTP"
              className="w-[400px] px-4 py-2 border rounded-3xl text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-[400px] bg-teal-500 hover:bg-teal-500 text-white py-2 mt-3 rounded-3xl"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {successMessage && (
          <p className="text-green-500 mt-4 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
