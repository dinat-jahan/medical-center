import React, { useState } from "react";

const ServicePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const services = [
    {
      icon: "fa fa-vials",
      title: "Pathology Department",
      description: "We offer lab testing and pathology services with scheduled staff shifts.",
      moreInfo: (
        <>
          <p className="mb-4">
            The Pathology Department at MBSTU Medical Center provides diagnostic services
            through lab tests and blood sample collection.
          </p>


          <h4 className="font-semibold text-lg text-teal-700 mb-2">🧪 Blood/Sample Collection Time</h4>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Morning: 8:00 AM – 12:00 PM</li>
            <li>Evening: 2:00 PM – 6:00 PM</li>
          </ul>

          <h4 className="font-semibold text-lg text-teal-700 mb-2">📋 Weekly Duty Roster</h4>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm text-left border border-gray-300">
              <thead className="bg-teal-100 text-gray-800">
                <tr>
                  <th className="border px-4 py-2">Day</th>
                  <th className="border px-4 py-2">Morning (8:00 AM - 2:00 PM)</th>
                  <th className="border px-4 py-2">Afternoon (2:00 PM - 8:00 PM)</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  ["Saturday", "Md.Mostafizur Rahman", "Shahoriyar Khan"],
                  ["Sunday", "Shahoriyar Khan", "Md.Mostafizur Rahman"],
                  ["Monday", "Md.Mostafizur Rahman", "Shahoriyar Khan"],
                  ["Tuesday", "Shahoriyar Khan", "Md.Mostafizur Rahman"],
                  ["Wednesday", "Md.Mostafizur Rahman", "Shahoriyar Khan"],
                ].map(([day, morning, afternoon], idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-4 py-2 font-medium">{day}</td>
                    <td className="border px-4 py-2">{morning}</td>
                    <td className="border px-4 py-2">{afternoon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold text-lg text-teal-700 mb-2">📞 Contact Numbers</h4>
          <ul className="list-disc list-inside text-gray-700">
            <li> Shahoriyar Khan  : 01700-614613</li>
            <li>Md.Mostafizur Rahman: 01751-457683</li>
          </ul>
        </>
      ),
    },
    {
      icon: "fa fa-ambulance",
      title: "24/7 Ambulance",
      description: "We provide 24/7 ambulance services to ensure immediate care.",
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
      description: "Access quality healthcare from your home via online consultation.",
      moreInfo:
        "Our telemedicine service allows patients to consult doctors through video calls and get prescriptions without visiting physically.",
    },
    {
      icon: "fa fa-pills",
      title: "Medicines",
      description: "Quality medicines are available at affordable prices.",
      moreInfo:
        "We offer both prescription and over-the-counter medicines, ensuring quality and authenticity at our on-campus pharmacy.",
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
          <div className="relative bg-teal-50 max-w-2xl w-full mx-4 rounded-lg shadow-lg p-6 min-h-[350px] max-h-[80vh] overflow-y-auto">
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
