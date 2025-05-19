// src/components/LoginForm.jsx
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);

  const backendURL = import.meta.env.DEV
    ? "http://localhost:2000"
    : import.meta.env.VITE_API_BASE_URL;

  async function loginUser(ev) {
    ev.preventDefault();

    // 1. Client-side validation
    if (!uniqueId.trim() || !password) {
      return setError("Unique ID and password are required.");
    }
    setError(null);

    try {
      const response = await axios.post(
        `${backendURL}/auth/login`,
        { uniqueId, password },
        { timeout: 5000 }
      );

      // 2. Successful login
      const { user } = response.data;
      setUser(user);
      setRedirect(true);
      window.location.reload();
      document.getElementById("login_modal").close();
    } catch (e) {
      // 3. Network vs. server errors
      if (!e.response) {
        setError("Unable to reach server. Check your connection.");
      } else {
        const { status, data } = e.response;
        switch (status) {
          case 400:
            setError(data.message);
            break;
          case 401:
          case 403:
            setError(data.message);
            break;
          default:
            setError("Something went wrong. Please try again later.");
        }
      }
    }
  }

  if (redirect) {
    window.location.reload();
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-semibold text-center font-poetsen text-primary mb-4">
            Login
          </h1>

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
            <span className="text-gray-700">Login with Google</span>
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="w-full py-2 bg-primary text-white font-medium rounded hover:bg-primary-dark transition"
            >
              Log In
            </button>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-primary font-medium underline">
            Register now
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
