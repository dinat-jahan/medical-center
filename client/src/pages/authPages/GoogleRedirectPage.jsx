import { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const GoogleRedirect = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the logged-in user from backend session
    axios
      .get("http://localhost:2000/api/whoami", { withCredentials: true })
      .then((res) => {
        setUser(res.data);

        navigate("/"); // fallback
      })
      .catch((err) => {
        console.error("Error fetching user from session:", err);
        navigate("/login"); // if something goes wrong
      });
  }, [setUser, navigate]);

  return <div className="text-center mt-20">Logging you in via Google...</div>;
};

export default GoogleRedirect;
