import React from "react";

const ContactPage = () => {
  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Contact us
            </h3>
            <p className="text-gray-600 mb-4">
              Feel free to contact us for any inquiries or suggestions. We are
              ready to respond to you.
            </p>
            <div className="mb-4">
              <strong className="text-gray-700">Address:</strong>
              <p className="text-gray-600">
                123 Medical Street, Dhaka, Bangladesh
              </p>
            </div>
            <div className="mb-4">
              <strong className="text-gray-700">Phone:</strong>
              <p className="text-gray-600">(+88) 02-12345678</p>
              <p className="text-gray-600">(+88) 02-87654321</p>
            </div>
            <div>
              <strong className="text-gray-700">Email:</strong>
              <p className="text-gray-600">info@medicalcenter.com</p>
              <p className="text-gray-600">support@medicalcenter.com</p>
            </div>
          </div>
          <div>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
