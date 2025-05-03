import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";

const RegisterPage = () => {
  const [step, setStep] = useState(1);

  // Conditional top margin classes
  const getStepMargin = () => {
    if (step === 2) return "mt-8";       // Slightly higher
    if (step === 1 || step === 3) return "mt-20"; // Slightly lower
    return "";
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-teal-50">
      <div className={`bg-white shadow-lg p-8 rounded-xl ${getStepMargin()}`}>
        <h2 className="text-4xl font-bold text-teal-500 text-center mb-6">Register</h2>

        {/* Google Login: Only on Step 1 */}
        {step === 1 && (
          <div className="flex justify-center mb-4">
            <a
              href="/auth/google"
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
            />
             <button
  onClick={() => setStep(2)}
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
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Department:</strong> CSE</p>
      <p><strong>Designation:</strong> Lecturer</p>
      <p><strong>Phone:</strong> 0123456789</p>
    </div>

    <div className="w-[400px] mt-6">
      <label htmlFor="emailSelect" className="block font-medium text-teal-600 mb-1">
        Select email to receive OTP:
      </label>
      <select
        id="emailSelect"
        className="w-full px-3 py-2 border rounded-3xl text-center"
      >
        <option value="example1@mbstu.ac.bd">example1@mbstu.ac.bd</option>
        <option value="example2@mbstu.ac.bd">example2@mbstu.ac.bd</option>
      </select>
    </div>

    <div className="flex justify-center mt-6">
      <button
        onClick={() => setStep(3)}
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
      type="text"
      placeholder="Enter OTP"
      className="w-[400px] px-4 py-2 border rounded-3xl text-center"
    />
    <button
      className="w-[400px] bg-teal-500 hover:bg-teal-500 text-white py-2 mt-3 rounded-3xl flex items-center justify-center border-none "
    >
      Verify OTP
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default RegisterPage;
