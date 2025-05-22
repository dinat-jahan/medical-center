import { useState, useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const OTP_VALIDITY_SECONDS = 20; // 2 minutes
const MAX_OTP_RETRIES = 3;

const backendURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL // localhost for dev
  : import.meta.env.VITE_API_BASE_URL;

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

  // For OTP resend logic:
  const [otpTimeout, setOtpTimeout] = useState(0);
  const [otpRetries, setOtpRetries] = useState(0);
  const timerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (otpTimeout > 0) {
      timerRef.current = setTimeout(() => setOtpTimeout(otpTimeout - 1), 1000);
    } else {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [otpTimeout]);

  const getStepMargin = () => {
    if (step === 2) return "mt-8";
    if (step === 1 || step === 3) return "mt-20";
    return "";
  };

  const fetchMemberInfo = async () => {
    setErrorMessage("");
    setSuccessMessage("");
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
    setSuccessMessage("");
    if (!emailForOtp) {
      setErrorMessage("Please select an email.");
      return;
    }
    try {
      const { data } = await api.post("/send-otp", { uniqueId, emailForOtp });
      if (data.success) {
        setSuccessMessage(data.message);
        setStep(3);
        setOtpRetries((prev) => prev + 1);
        setOtpTimeout(OTP_VALIDITY_SECONDS);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      // Handle backend errors like retry limits or OTP already sent
      const msg =
        err.response?.data?.message || `Error sending OTP: ${err.message}`;
      setErrorMessage(msg);
    }
  };

  const verifyOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
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
      const msg =
        err.response?.data?.message || `Error verifying OTP: ${err.message}`;
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Back button handler
  const handleBack = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (step === 3) {
      // Reset OTP input if going back from OTP step
      setOtp("");
    }
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
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

            <div className="flex justify-between mt-6 w-[400px]">
              <button
                onClick={handleBack}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-3xl"
              >
                Back
              </button>

              <button
                onClick={sendOtp}
                disabled={isFetching || otpRetries >= MAX_OTP_RETRIES}
                className={`py-2 px-6 rounded-3xl text-white ${
                  otpRetries >= MAX_OTP_RETRIES
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-teal-500"
                }`}
              >
                {isFetching ? "Sending…" : "Send OTP"}
              </button>
            </div>

            {otpRetries > 0 && (
              <p className="mt-2 text-center text-sm text-gray-700 w-[400px]">
                OTP sent {otpRetries} time{otpRetries > 1 ? "s" : ""}.
                {otpRetries >= MAX_OTP_RETRIES
                  ? " You have reached the maximum number of OTP attempts."
                  : ""}
              </p>
            )}
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
            <div className="flex justify-between w-[400px]">
              <button
                onClick={handleBack}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-3xl"
              >
                Back
              </button>
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="bg-teal-500 hover:bg-teal-500 text-white py-2 px-6 rounded-3xl"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            {otpTimeout > 0 && (
              <p className="mt-2 text-center text-sm text-gray-700 w-[400px]">
                OTP expires in: {otpTimeout} second{otpTimeout !== 1 ? "s" : ""}
              </p>
            )}

            {otpTimeout === 0 && otpRetries < MAX_OTP_RETRIES && (
              <button
                onClick={sendOtp}
                disabled={isFetching}
                className="mt-2 bg-blue-600 hover:bg-teal-600 text-white py-2 px-6 rounded-3xl"
              >
                Resend OTP
              </button>
            )}

            {otpRetries >= MAX_OTP_RETRIES && (
              <p className="mt-2 text-center text-sm text-red-600 w-[400px]">
                Maximum OTP retries reached. Please try again later.
              </p>
            )}
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
