import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [uniqueId, setUniqueId] = useState("");
  const [memberInfo, setMemberInfo] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const backendURL = import.meta.env.DEV
    ? "http://localhost:2000"
    : import.meta.env.VITE_API_BASE_URL;

  // Conditional top margin classes
  const getStepMargin = () => {
    if (step === 2) return "mt-8"; // Slightly higher
    if (step === 1 || step === 3) return "mt-20"; // Slightly lower
    return "";
  };

  //fetch member info from backend
  const fetchMemberInfo = async () => {
    setIsFetching(true); //start loading
    try {
      const { data } = await axios.get(`/auth/fetch-member/${uniqueId}`);
      console.log(data);
      if (data.success) {
        setMemberInfo(data.member);
        if (data.member?.emails?.length > 0) {
          setEmailForOtp(data.member.emails[0]);
        }
        setStep(2);
      } else {
        setErrorMessage(data.message);
      }
    } catch (e) {
      console.log(e);
      setErrorMessage("Error fetching member info");
    } finally {
      setIsFetching(false); //stop loading after the request is complete
    }
  };

  //send otp to the selected email
  const sendOtp = async () => {
    console.log(emailForOtp);
    try {
      const response = await axios.post("/auth/send-otp", {
        uniqueId,
        emailForOtp,
      });
      console.log(response);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setStep(3);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Error sending OTP");
    }
  };

  //verify OTP
  const verifyOtp = async () => {
    console.log("otp", otp);
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/verify-otp", {
        uniqueId,
        otp,
      });
      console.log(data);
      if (data.success) {
        setSuccessMessage(data.message);
        navigate(`/set-password?uniqueId=${uniqueId}`);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Error verifying otp");
    } finally {
      setLoading(false);
    }
  };

  const dateOfBirth = new Date(memberInfo.dob);
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

        {/* Google Login: Only on Step 1 */}
        {step === 1 && (
          <div className="flex justify-center mb-4">
            <a
              href={`${backendURL}/auth/google`}
              className="w-[400px] bg-violet-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-3xl flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-2xl bg-white rounded-full" />
              Login with Google
            </a>
          </div>
        )}

        {/* Step 1: Unique ID Input */}
        {step === 1 && (
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
              className="w-[400px] bg-sky-500 hover:bg-teal-500 text-white py-2 mt-5 rounded-3xl flex items-center justify-center border-none "
            >
              Fetch Info
            </button>
          </div>
        )}
        {/* Step 2: Show Member Info */}
        {step === 2 && (
          <div className="flex flex-col items-center mt-4 text-left w-full">
            <h4 className="text-xl text-teal-500 font-semibold mb-4 w-[400px]">
              Member Details Found:
            </h4>

            <div className="w-[400px] space-y-2 text-black-700">
              <p>
                <strong>Name:</strong> {memberInfo?.name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {formattedDate}
              </p>
              <p>
                <strong>Phone:</strong> {memberInfo?.phone}
              </p>

              {(memberInfo?.userType === "student" ||
                memberInfo?.userType === "teacher") && (
                <p>
                  <strong>Department:</strong> {memberInfo?.department}
                </p>
              )}

              {(memberInfo?.userType === "teacher" ||
                memberInfo?.userType === "staff") && (
                <p>
                  <strong>Designation:</strong> {memberInfo?.designation}
                </p>
              )}
            </div>

            {/* Email Dropdown */}
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
                {memberInfo?.emails?.map((email) => (
                  <option value={email} key={email}>
                    {email}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={sendOtp}
                className="w-[400px] bg-blue-500 hover:bg-teal-500 text-white py-2 mt-3 rounded-3xl flex items-center justify-center border-none"
              >
                Send OTP
              </button>
            </div>
          </div>
        )}

        {/* Step 3: OTP Input */}
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
              className="w-[400px] bg-teal-500 hover:bg-teal-500 text-white py-2 mt-3 rounded-3xl flex items-center justify-center border-none"
              onClick={() => {
                console.log("Button clicked!");
                verifyOtp();
              }}
              disabled={loading}
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
