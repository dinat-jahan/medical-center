import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa"; // Importing Font Awesome icons

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false); // State to manage visibility of the "Go to Top" button

  const handleScroll = () => {
    // Function to check scroll position and update button visibility
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    // Function to scroll to the top of the page smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // useEffect hook to add and remove the scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once after the initial render and cleans up on unmount

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 relative">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h6 className="text-lg font-semibold mb-4">Important Links</h6>
          <ul className="list-none">
            <li className="mb-2">
              <a href="#" className="hover:text-blue-400">
                About us
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-blue-400">
                Doctors
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-blue-400">
                Medical Staffs
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-blue-400">
                Services
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="text-lg font-semibold mb-4">Contact Us</h6>
          <p className="mb-2">
            Feel free to contact us for any inquiries or suggestions. We are
            ready to respond to you.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Address:</span>
            <br />
            123 Medical Street, Dhaka, Bangladesh
          </p>
          <p className="mb-2">
            <span className="font-semibold">Phone:</span>
            <br />
            (+88) 02-12345678
            <br />
            (+88) 02-87654321
          </p>
          <p className="mb-2">
            <span className="font-semibold">Email:</span>
            <br />
            <a
              href="mailto:info@medicalcenter.com"
              className="hover:text-blue-400"
            >
              info@medicalcenter.com
            </a>
            <br />
            <a
              href="mailto:support@medicalcenter.com"
              className="hover:text-blue-400"
            >
              support@medicalcenter.com
            </a>
          </p>
        </div>
      </div>

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-300"
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
