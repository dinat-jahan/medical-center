import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const Header = () => {
  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

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
    navigate(path);
  };

  return (
    <div className="relative shadow-md">
      <header className="flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="mbstu_logo.png" alt="MBSTU Logo" className="w-14 mr-2" />
          <span className="text-2xl font-poetsen text-primary mt-1 hidden md:inline">
            MBSTU Medical Center
          </span>
        </Link>

        {/* Menu Icon for Mobile */}
        <div className="flex lg:hidden absolute right-4 top-4">


          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-primary text-white p-2 rounded-full focus:outline-none">
            <Menu className="w-8 h-8" />
          </button>
        </div>

        {/* Large Screen Menu */}
        <ul className="hidden lg:flex space-x-5 text-red-500 font-semibold items-center relative">
          <li>
            <Link className="hover:text-blue-900 transition-colors" to="/">Home</Link>
          </li>
          <li>
            <Link className="hover:text-blue-900 transition-colors" to="/about">About</Link>
          </li>
          <li
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/people" className="hover:text-blue-900 transition-colors">
              People
            </Link>
            {isPeopleDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-base-200 rounded-md shadow-lg w-32 z-20">
                <ul className="flex flex-col p-2">
                  <li>
                    <Link to="/doctors" className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-900 transition-colors">
                      Doctors
                    </Link>
                  </li>
                  <li>
                    <Link to="/medical-staffs" className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-900 transition-colors">
                      Staffs
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <Link className="hover:text-blue-900 transition-colors" to="/services">Services</Link>
          </li>
          <li>
            <Link className="hover:text-blue-900 transition-colors" to="/contact">Contact</Link>
          </li>
          <li>
            <button
              className="hover:text-blue-900 transition-colors focus:outline-none"
              onClick={() => document.getElementById("login_modal").showModal()}
            >
              Login
            </button>
          </li>
          <li>
            <Link className="hover:text-blue-900 transition-colors" to="/register">Register</Link>
          </li>
        </ul>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 bg-base-200 py-4 shadow-md w-full z-10">
          <ul className="flex flex-col items-start px-6 space-y-2 text-red-500 font-semibold">
            <li>
              <Link to="/" onClick={() => handleMobileMenuClick("/")} className="hover:text-blue-900 transition-colors block">Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => handleMobileMenuClick("/about")} className="hover:text-blue-900 transition-colors block">About</Link>
            </li>
            <li className="relative">
              <Link to="/people" onClick={(e) => { e.preventDefault(); setIsPeopleDropdownOpen(!isPeopleDropdownOpen); }} className="hover:text-blue-900 transition-colors block">
                People
              </Link>
              {isPeopleDropdownOpen && (
                <ul className="ml-4 mt-2 space-y-2">
                  <li>
                    <Link to="/doctors" onClick={() => handleMobileMenuClick("/doctors")} className="hover:text-blue-900 transition-colors block">Doctors</Link>
                  </li>
                  <li>
                    <Link to="/medical-staffs" onClick={() => handleMobileMenuClick("/medical-staffs")} className="hover:text-blue-900 transition-colors block">Staffs</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/services" onClick={() => handleMobileMenuClick("/services")} className="hover:text-blue-900 transition-colors block">Services</Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => handleMobileMenuClick("/contact")} className="hover:text-blue-900 transition-colors block">Contact</Link>
            </li>
            <li>
              <button
                className="hover:text-blue-900 transition-colors focus:outline-none bg-primary text-white px-3 py-1 rounded-md text-sm block text-left"
                onClick={() => {
                  document.getElementById("login_modal").showModal();
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </button>
            </li>
            <li>
              <Link to="/register" onClick={() => handleMobileMenuClick("/register")} className="hover:text-blue-900 transition-colors block">Register</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;