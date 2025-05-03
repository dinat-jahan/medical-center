import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header2 = () => {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(window.location.pathname);

  const handleNavigation = (path) => {
    if (window.location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
      setActivePath(path);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        {/* Mobile menu button */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button onClick={() => handleNavigation("/")}>Home</button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/about")}>About</button>
            </li>
            <li>
              <details>
                <summary>People</summary>
                <ul className="p-2">
                  <li>
                    <button onClick={() => handleNavigation("/doctors")}>
                      Doctors
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation("/medical-staffs")}>
                      Staffs
                    </button>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <button onClick={() => handleNavigation("/services")}>
                Services
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/contact")}>
                Contact
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  document.getElementById("login_modal").showModal()
                }
              >
                Login
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("/register")}>
                Register
              </button>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="btn btn-ghost text-xl"
        >
          MBSTU Medical
        </button>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-red-500 font-semibold">
          <li>
            <button onClick={() => handleNavigation("/")}>Home</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/about")}>About</button>
          </li>
          <li>
            <details>
              <summary>People</summary>
              <ul className="p-2 bg-base-100 rounded-box">
                <li>
                  <button onClick={() => handleNavigation("/doctors")}>
                    Doctors
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/medical-staffs")}>
                    Staffs
                  </button>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <button onClick={() => handleNavigation("/services")}>
              Services
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/contact")}>
              Contact
            </button>
          </li>
        </ul>
      </div>

      {/* Login/Register */}
      <div className="navbar-end space-x-2">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => document.getElementById("login_modal").showModal()}
        >
          Login
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleNavigation("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Header2;
