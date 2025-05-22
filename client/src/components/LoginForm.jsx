// === src/components/LoginForm.jsx ===
import { useContext, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_API_BASE_URL // localhost for dev
    : import.meta.env.VITE_API_BASE_URL;

  async function loginUser(ev) {
    ev.preventDefault();
    if (!uniqueId.trim() || !password) {
      return setError("Unique ID and password are required.");
    }
    setError(null);
    try {
      const { data } = await axios.post(
        `${backendURL}/auth/login`,
        { uniqueId, password },
        { timeout: 5000 }
      );
      setUser(data.user);
      setRedirect(true);
      // Close modal after successful login
      const modal = document.getElementById("login_modal");
      if (modal) modal.close();
      window.location.href = "/";
    } catch (e) {
      if (!e.response) {
        setError("Unable to reach server. Check your connection.");
      } else {
        const { status, data } = e.response;
        if (status === 400 || status === 401 || status === 403) {
          setError(data.message);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
    }
  }

  // Close modal before navigating to forgot password page
  function handleForgotPasswordClick() {
    const modal = document.getElementById("login_modal");
    if (modal) modal.close();
    navigate("/forgot-password");
  }

  // if (redirect) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-semibold text-center mb-4">Login</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <a
            href={`${backendURL}/auth/google`}
            className="flex justify-center items-center w-full mb-5 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FcGoogle className="text-2xl mr-2" />
            <span>Login with Google</span>
          </a>

          <div className="text-center text-gray-500 mb-5">
            or continue with Unique ID and Password
          </div>

          <form onSubmit={loginUser} className="space-y-4">
            <input
              type="text"
              placeholder="Unique ID"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className="text-sm text-primary hover:underline bg-transparent border-none p-0"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white font-medium rounded hover:bg-primary-dark transition"
            >
              Log In
            </button>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
