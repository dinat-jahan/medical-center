import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // toggle state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative shadow-md">
      <header className="flex justify-between items-center px-4 py-3">
        {/* Logo & Title */}
        <Link to="/" className="flex items-center">
          <img src="mbstu_logo.png" alt="mbstu_logo" className="w-14 mr-2" />
          <span className="text-2xl font-poetsen text-primary mt-1">
            MBSTU Medical Center
          </span>
        </Link>

        {/* Hamburger icon (only on small screens) */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-red-500 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Menu - large screen */}
        <ul className="hidden lg:flex space-x-5 text-red-500 font-semibold">
          <li>
            <Link
              className="hover:text-blue-900 hover:transition-colors"
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-blue-900 hover:transition-colors"
              to="/about"
            >
              About
            </Link>
          </li>
          <li className="relative group">
            <button className="hover:text-blue-900 hover:transition-colors focus:outline-none">
              People
            </button>
            <ul className="absolute hidden group-hover:block bg-base-200 rounded-box z-1 mt-2 w-32 p-2 shadow-sm">
              <li>
                <Link
                  className="hover:text-blue-900 hover:transition-colors block py-1"
                  to="/doctors"
                >
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-900 hover:transition-colors block py-1"
                  to="/medical-staffs"
                >
                  Staffs
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              className="hover:text-blue-900 hover:transition-colors"
              to="/services"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-blue-900 hover:transition-colors"
              to="/contact"
            >
              Contact
            </Link>
          </li>
          <li>
            <button
              className="hover:text-blue-900 hover:transition-colors focus:outline-none"
              onClick={() => {
                document.getElementById("login_modal").showModal();
              }}
            >
              Login
            </button>
          </li>
          <li>
            <Link
              className="hover:text-blue-900 hover:transition-colors"
              to="/register"
            >
              Register
            </Link>
          </li>
        </ul>

        {/* Menu - mobile screen toggle */}
        {isMenuOpen && (
          <ul className="lg:hidden flex flex-col px-4 pb-4 space-y-2 text-red-500 font-semibold bg-white">
            <li>
              <Link
                className="hover:text-blue-900 hover:transition-colors"
                to="/"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-blue-900 hover:transition-colors"
                to="/about"
                onClick={toggleMenu}
              >
                About
              </Link>
            </li>
            <li className="relative">
              <button
                className="hover:text-blue-900 hover:transition-colors focus:outline-none w-full text-left py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                People
              </button>
              <ul className="ml-4 space-y-2">
                <li>
                  <Link
                    className="hover:text-blue-900 hover:transition-colors text-sm"
                    to="/doctors"
                    onClick={toggleMenu}
                  >
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-blue-900 hover:transition-colors text-sm"
                    to="/medical-staffs"
                    onClick={toggleMenu}
                  >
                    Staffs
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                className="hover:text-blue-900 hover:transition-colors"
                to="/services"
                onClick={toggleMenu}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-blue-900 hover:transition-colors"
                to="/contact"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-blue-900 hover:transition-colors"
                to="/login"
                onClick={toggleMenu}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-blue-900 hover:transition-colors"
                to="/register"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </li>
          </ul>
        )}
      </header>
    </div>
  );
};

export default Header;
