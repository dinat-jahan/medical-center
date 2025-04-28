import React from "react";

const ServicePage = () => {
  const services = [
    {
      icon: "fas fa-notes-medical",
      title: "Free Checkup",
      description:
        "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Doloribus Magnam.",
      linkText: "Learn More",
      linkUrl: "#",
    },
    {
      icon: "fa fa-ambulance",
      title: "24/7 Ambulance",
      description:
        "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Doloribus Magnam.",
      linkText: "Learn More",
      linkUrl: "#",
    },
    {
      icon: "fa fa-user-md",
      title: "Experts Consultancy",
      description:
        "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Doloribus Magnam.",
      linkText: "Learn More",
      linkUrl: "#",
    },
    {
      icon: "fa fa-pills",
      title: "Medicines",
      description:
        "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Doloribus Magnam.",
      linkText: "Learn More",
      linkUrl: "#",
    },
    {
      icon: "fa fa-bed",
      title: "Bed Facility",
      description:
        "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Doloribus Magnam.",
      linkText: "Learn More",
      linkUrl: "#",
    },
    {
      icon: "fa fa-heartbeat",
      title: "Total Care",
      description:
        "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Doloribus Magnam.",
      linkText: "Learn More",
      linkUrl: "#",
    },
  ];

  const OurServicesCard = ({ icon, title, description, linkText, linkUrl }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-500 flex items-center justify-center mb-4">
          <i className={icon}></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <a
          href={linkUrl}
          className="bg-teal-200 hover:bg-teal-300 text-teal-800 font-semibold py-2 px-4 rounded-full text-sm flex items-center"
        >
          {linkText}
          <span className="ml-2">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </a>
      </div>
    );
  };

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto text-center mb-8 px-6">
        {" "}
        {/* এখানে px-6 যোগ করা হয়েছে */}
        <h2 className="text-3xl font-bold text-teal-500">OUR SERVICES</h2>
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {" "}
        {/* এখানে px-6 যোগ করা হয়েছে */}
        {services.map((service, index) => (
          <OurServicesCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default ServicePage;
