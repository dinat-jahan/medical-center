import React, { useState } from "react";
import PathologyDetails from "./component/PathologyDetails";
import { TelemedicineInfo } from "./component/TelemedicineInfo";
const ServicePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const services = [
    {
      icon: "fa fa-vials",
      title: "Pathology Department",
      description:
        "We offer lab testing and pathology services with scheduled staff shifts.",
      moreInfo: <PathologyDetails />,
    },
    {
      icon: "fa fa-ambulance",
      title: "24/7 Ambulance",
      description:
        "We provide 24/7 ambulance services to ensure immediate care.",
      moreInfo:
        "Our ambulances are equipped with emergency life-saving tools and are operated by trained medical personnel to ensure safe and timely patient transport.",
    },
    {
      icon: "fa fa-ambulance",
      title: "Emergency",
      description: "Emergency medical care is available 24/7 for urgent needs.",
      moreInfo:
        "Our emergency unit is equipped with necessary life-saving equipment and staff to handle all types of critical health situations promptly.",
    },
    {
      icon: "fa fa-heartbeat",
      title: "Telemedicine",
      description:
        "Access healthcare services conveniently from your home by speaking directly with doctors over the phone.",
      moreInfo: <TelemedicineInfo />,
    },
    {
      icon: "fa fa-pills",
      title: "Medicines",
      description:
        "Quality, authentic medicines are available at our on-campus pharmacy to support the health needs of all community members.",
      moreInfo:
        "Our pharmacy operates with policies designed to fairly serve students, staff, and faculty. We ensure access to essential medications while managing resources responsibly to maintain high standards of care.",
    },
    {
      icon: "fa fa-bed",
      title: "Bed Facility",
      description: "Comfortable and clean bed facilities for in-patient care.",
      moreInfo:
        "Our wards are regularly cleaned, ventilated, and monitored by medical staff to maintain hygiene and patient comfort.",
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
        <h3 className="text-xl text-center font-semibold text-gray-800 mb-2">
          {service.title}
        </h3>
        <p className="text-gray-600 text-center text-sm mb-4">
          {service.description}
        </p>
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
        <h2 className="text-3xl font-poetsen text-teal-400 mb-4">
          OUR SERVICES
        </h2>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {services.map((service, index) => (
          <OurServicesCard key={index} service={service} index={index} />
        ))}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-teal-50 max-w-2xl w-full mx-4 rounded-lg shadow-lg p-6 min-h-[350px] max-h-[80vh] overflow-y-auto">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 w-8 h-8 bg-teal-500 hover:bg-teal-700 text-white rounded-full flex items-center justify-center text-lg font-bold transition border-none"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              {services[activeIndex].title}
            </h3>
            <p className="text-gray-700  text-base">
              {services[activeIndex].description}
            </p>
            <div className="text-gray-700 text-base mt-4 space-y-2 overflow-y-auto">
              {services[activeIndex].moreInfo}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
