import React, { useState } from "react";

const ServicePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const services = [
    {
      icon: "fas fa-notes-medical",
      title: "Free Checkup",
      description: "Get a free checkup with our top-notch facilities and doctors.",
      moreInfo: "Our free checkup service includes blood pressure, glucose, and general consultation to keep your health in check regularly.",
    },
    {
      icon: "fa fa-ambulance",
      title: "24/7 Ambulance",
      description: "We provide 24/7 ambulance services to ensure immediate care.",
      moreInfo: "Our ambulances are equipped with emergency life-saving tools and are operated by trained medical personnel to ensure safe and timely patient transport.",
    },
    {
      icon: "fa fa-user-md",
      title: "Experts Consultancy",
      description: "Consult with highly experienced medical professionals anytime.",
      moreInfo: "Get access to specialist doctors for different medical fields including cardiology, neurology, dermatology, and more.",
    },
    {
      icon: "fa fa-pills",
      title: "Medicines",
      description: "Quality medicines are available at affordable prices.",
      moreInfo: "We offer both prescription and over-the-counter medicines, ensuring quality and authenticity at our on-campus pharmacy.",
    },
    {
      icon: "fa fa-bed",
      title: "Bed Facility",
      description: "Comfortable and clean bed facilities for in-patient care.",
      moreInfo: "Our wards are regularly cleaned, ventilated, and monitored by medical staff to maintain hygiene and patient comfort.",
    },
    {
      icon: "fa fa-heartbeat",
      title: "Total Care",
      description: "We provide complete health care support around the clock.",
      moreInfo: "Our total care package includes diagnosis, treatment, follow-up, and mental health support all under one roof.",
    },
  ];

  const OurServicesCard = ({ service, index }) => {
    const handleLearnMore = () => {
      setActiveIndex(index);
    };

    return (
      <div className="relative bg-teal-50 border border-teal-500 rounded-xl shadow-md p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
        <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center mb-4 text-2xl">
          <i className={service.icon}></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        <button
          onClick={handleLearnMore}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition duration-300 w-40 border-none"
        >
          Learn More
        </button>
      </div>
    );
  };

  const closePopup = () => {
    setActiveIndex(null);
  };

  return (
    <div className="py-12 bg-teal-50">
      <div className="container mx-auto text-center mb-8 px-6">
        <h2 className="text-3xl font-poetsen text-teal-400 mb-4">OUR SERVICES</h2>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {services.map((service, index) => (
          <OurServicesCard key={index} service={service} index={index} />
        ))}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-teal-50 max-w-2xl w-full mx-4 rounded-lg shadow-lg p-6 min-h-[350px]">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 w-8 h-8 bg-teal-500 hover:bg-teal-700 text-white rounded-full flex items-center justify-center text-lg font-bold transition border-none"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {services[activeIndex].title}
            </h3>
            <p className="text-gray-700 text-base">{services[activeIndex].description}</p>
            <p className="text-gray-700 text-base mt-4">{services[activeIndex].moreInfo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
