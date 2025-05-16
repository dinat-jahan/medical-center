import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  const backendURL = import.meta.env.DEV
    ? "http://localhost:2000"
    : import.meta.env.VITE_API_BASE_URL;

  async function loginUser(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", {
        uniqueId,
        password,
      });
      console.log("Logged in user:", data);
      setUser(data);
      setRedirect(true);
      document.getElementById("login_modal").close();
    } catch (e) {
      console.log(e);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex  mt-12  flex-col max-w-md mx-auto item-center justify-center">
      <h1 className="text-center text-4xl font-poetsen text-primary">Login</h1>
      <div className="p-5">
        <div>
          <a
            href={`${backendURL}/auth/google`}
            className="flex mt-3 justify-center items-center gap-5 border border-gray-500 bg-white text-primary p-2 rounded"
          >
            <FcGoogle className="text-2xl bg-white rounded-full" />
            Login with Google
          </a>
        </div>
        <div className=" divider text-center text-gray-500 py-2 ">
          or continue with uniqueId and password
        </div>

        <form onSubmit={loginUser}>
          <input
            type="text"
            placeholder="Enter your uniqueId.."
            value={uniqueId}
            onChange={(ev) => setUniqueId(ev.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password.."
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button>Log in</button>
        </form>
        <div className="text-center text-gray-500">
          Don't have an account yet?{" "}
          <Link className="text-black underline" to={"/register"}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
