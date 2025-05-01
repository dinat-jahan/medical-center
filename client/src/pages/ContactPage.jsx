import React from "react";

const ContactPage = () => {
  return (
    <div className="bg-teal-50 max-w-4xl mx-auto mt-5 px-1 pt-5">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-8 bg-teal-150">
        <h2 className="text-3xl font-poetsen text-teal-500 mb-6">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-teal-500 text-xl">
          <div>
            {/* <h3 className="text-teal-500 text-2xl font-bold mb-2">
              Contact us
            </h3> */}
            <p className="text-gray-700 mb-4">
              Feel free to contact us for any inquiries or suggestions. We are
              ready to respond to you.
            </p>
            <div className="mb-4">
              <strong >Address:</strong>
              <p className="text-gray-900">
                123 Medical Street, Dhaka, Bangladesh
              </p>
            </div>
            <div className="mb-4">
              <strong>Phone:</strong>
              <p className="text-gray-900">(+88) 02-12345678</p>
              <p className="text-gray-900">(+88) 02-87654321</p>
            </div>
            <div>
              <strong >Email:</strong>
              <p className="text-gray-900">info@medicalcenter.com</p>
              <p className="text-gray-900">support@medicalcenter.com</p>
            </div>
          </div>
          <div className="block text-teal-500 text-2xl  mb-2">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-teal-500 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-teal-500 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-teal-500 hover:bg-sky-800 text-white font-2xl py-2 px-4 rounded-3xl border-1 border-black focus:outline-none focus:shadow-outline"
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
