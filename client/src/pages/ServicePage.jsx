import React from "react";
import { Link } from "react-router-dom";

const ServicePage = () => {
  const services = [
    {
      icon: "fas fa-notes-medical",
      title: "Free Checkup",
      description: "Get a free checkup with our top-notch facilities and doctors.",
      linkText: "Learn More",
      linkUrl: "/services/free-checkup",
    },
    {
      icon: "fa fa-ambulance",
      title: "24/7 Ambulance",
      description: "We provide 24/7 ambulance services to ensure immediate care.",
      linkText: "Learn More",
      linkUrl: "/services/ambulance",
    },
    {
      icon: "fa fa-user-md",
      title: "Experts Consultancy",
      description: "Consult with highly experienced medical professionals anytime.",
      linkText: "Learn More",
      linkUrl: "/services/consultancy",
    },
    {
      icon: "fa fa-pills",
      title: "Medicines",
      description: "Quality medicines are available at affordable prices.",
      linkText: "Learn More",
      linkUrl: "/services/medicines",
    },
    {
      icon: "fa fa-bed",
      title: "Bed Facility",
      description: "Comfortable and clean bed facilities for in-patient care.",
      linkText: "Learn More",
      linkUrl: "/services/bed-facility",
    },
    {
      icon: "fa fa-heartbeat",
      title: "Total Care",
      description: "We provide complete health care support around the clock.",
      linkText: "Learn More",
      linkUrl: "/services/total-care",
    },
  ];

  const OurServicesCard = ({ icon, title, description, linkText, linkUrl }) => {
    return (
      <div className="bg-white border border-sky-300 rounded-xl shadow-md p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
        <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-500 flex items-center justify-center mb-4 text-2xl">
          <i className={icon}></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Link
          to={linkUrl}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition duration-300"
        >
          {linkText}
        </Link>
      </div>
    );
  };

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto text-center mb-8 px-6">
        <h2 className="text-3xl font-poetsen text-teal-600 mb-4">OUR SERVICES</h2>
      
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {services.map((service, index) => (
          <OurServicesCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default ServicePage;
