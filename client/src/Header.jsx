import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, UserIcon } from "lucide-react";
import { UserContext } from "./UserContext";
import { roleMenus } from "./constants";
import RoleMenu from "./components/RoleMenu";
import axios from "axios";
import logo from "../src/assets/mbstu_logo.png";
const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Event listener to handle window resizing and close profile menu on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Close menu if on desktop
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPeopleDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsPeopleDropdownOpen(false);
    }, 200);
  };

  const handleMobileMenuClick = (path) => {
    setIsMobileMenuOpen(false);
    setIsPeopleDropdownOpen(false);
    if (window.location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  const handleProfileMenuClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen); //toggle the profile menu
  };

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout");
      setUser(null); //log the user out
      setIsProfileMenuOpen(false); //close the profile menu
      navigate("/"); //redirect to login
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative shadow-md bg-white z-50">
      <header className="flex justify-between items-center px-4 py-3">
        {/* Mobile Menu Icon on small screen */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-primary text-white p-2 rounded-full"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        {/* Logo & Name */}
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={() => handleMobileMenuClick("/")}
        >
          <img
            src={logo}
            alt="MBSTU Logo"
            className="w-14 h-14 object-contain"
          />
          <span className="text-2xl font-poetsen text-primary hidden md:inline-block">
            MBSTU Medical Center
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-5 text-red-500 font-semibold items-center">
          <li>
            <Link className="hover:text-blue-900" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-blue-900" to="/about">
              About
            </Link>
          </li>
          <li
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* <Link className="hover:text-blue-900" to="/people">
              People
            </Link> */}
            <div className="hover:text-blue-900">People</div>
            {isPeopleDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-base-200 rounded-md shadow-lg w-32 z-20">
                <ul className="flex flex-col p-2">
                  <li>
                    <Link
                      to="/doctors"
                      className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-900"
                    >
                      Doctors
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/medical-staffs"
                      className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-900"
                    >
                      Staffs
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <Link className="hover:text-blue-900" to="/services">
              Services
            </Link>
          </li>
          <li>
            <Link className="hover:text-blue-900" to="/duty-roster-of-doctors">
              Doctor Schedule
            </Link>
          </li>
          <li>
            <Link className="hover:text-blue-900" to="/telemedicine">
              Telemedicine
            </Link>
          </li>
          <li>
            <Link className="hover:text-blue-900" to="/duty-roster-staff">
              Staff Duty Roster
            </Link>
          </li>
          {user ? (
            <li>
              <button
                className="bg-red-700 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <button
                  className="bg-red-700 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
                  onClick={() =>
                    document.getElementById("login_modal").showModal()
                  }
                >
                  Login
                </button>
              </li>
              <li>
                <Link
                  className="bg-violet-700 text-white px-4 py-1 rounded-md hover:bg-violet-800 transition"
                  to="/register"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
        {/* Profile icon for smaller screen */}
        <div className="block lg:hidden items-center space-x-4">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="text-white focus:outline-none rounded-full"
          >
            <UserIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
      {/* Show Role Menu in second row if logged in */}
      {user && <RoleMenu />}
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-base-100 shadow-md z-40">
          <ul className="flex flex-col space-y-2 p-4 text-red-500 font-semibold">
            <li>
              <button
                onClick={() => handleMobileMenuClick("/")}
                className="text-left w-full"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMobileMenuClick("/about")}
                className="text-left w-full"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsPeopleDropdownOpen(!isPeopleDropdownOpen)}
                className="text-left w-full"
              >
                People
              </button>
              {isPeopleDropdownOpen && (
                <ul className="ml-4 mt-1 space-y-1">
                  <li>
                    <button
                      onClick={() => handleMobileMenuClick("/doctors")}
                      className="text-left w-full"
                    >
                      Doctors
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleMobileMenuClick("/medical-staffs")}
                      className="text-left w-full"
                    >
                      Staffs
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => handleMobileMenuClick("/services")}
                className="text-left w-full"
              >
                Services
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMobileMenuClick("/duty-roster-of-doctors")}
                className="text-left w-full"
              >
                Doctor Schedule
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMobileMenuClick("/telemedicine")}
                className="text-left w-full"
              >
                Doctor Schedule
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMobileMenuClick("/duty-roster-staff")}
                className="text-left w-full"
              >
                Staff Duty Roster
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  document.getElementById("login_modal").showModal();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-red-700 text-white px-3 py-1 rounded-md w-full text-left"
              >
                Login
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMobileMenuClick("/register")}
                className="bg-violet-700 text-white px-4 py-1 rounded-md w-full text-left"
              >
                Register
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Profile menu links */}
      {isProfileMenuOpen && (
        <div className="absolute  right-0 mt-2 bg-base-200 rounded-md shadow-lg w-48 z-20">
          <ul className="flex flex-col p-2">
            {!user ? (
              <>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById("login_modal").showModal();
                      setIsProfileMenuOpen(false);
                    }}
                    className="bg-red-700 text-white px-3 py-1 rounded-md w-full text-left"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <Link
                    className="bg-violet-700 text-white px-4 py-1 rounded-md hover:bg-violet-800 transition"
                    to="/register"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              roleMenus[user.role]?.map((menuItem) => (
                <li key={menuItem.name}>
                  <Link
                    key={menuItem.path}
                    to={menuItem.path}
                    className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-900"
                  >
                    {menuItem.name}
                  </Link>
                </li>
              ))
            )}

            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-900"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
