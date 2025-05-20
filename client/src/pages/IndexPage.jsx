import { Link } from "react-router-dom";
import doctor_standing from "../assets/doctor_standing.jpg";
import ServicePage from "./commonPages/servicePages.jsx/ServicePage";

const IndexPage = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-80 flex items-center justify-center overflow-hidden mb-6">
        <img
          src="https://cdn-ilddgbh.nitrocdn.com/KCiiUwRzwPIrRDjogfTRMgHMpGyyzAgg/assets/images/optimized/rev-f7111be/mbstu.ac.bd/wp-content/uploads/2024/11/Overview-photo-1-1-768x628.jpeg"
          alt="MBSTU Medical Center"
          className="w-full h-full object-cover absolute inset-0 brightness-75"
        />
        <div className="text-center text-white font-poetsen px-4 py-8 relative z-10 flex items-center justify-center h-full w-full">
          <div className="text-4xl lg:text-5xl font-bold leading-snug">
            Welcome to
            <br className="sm:block md:hidden" />
            <span className="text-red-700 drop-shadow-lg"> MBSTU </span>
            <br className="sm:block md:block lg:hidden" />
            Medical Center
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-teal-50 py-10 px-4 md:px-12 mx-auto">
        <div className="container mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row justify-center md:items-stretch gap-8">
            {/* Doctor Image */}
            <div className="hidden md:block md:w-[40%] md:mr-8">
              <img
                src={doctor_standing}
                alt="Our Doctors"
                className="w-full h-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* About Text */}
            <div className="w-full md:w-[60%] md:ml-8 text-left flex flex-col justify-start">
              <h2 className="text-4xl font-poetsen text-teal-500 mt-1 max-md:text-center mb-4">
                ABOUT US
              </h2>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 leading-relaxed">
                We Take Care Of Your Healthy Life
              </h3>
              <p className="text-gray-600 leading-7 mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
                dolorem nesciunt eos fugio minus eveniet ut accusamus distinctio
                provident autem nemo cumque corporis odio ea ipsum eum quae modi
                officiis.
              </p>
              <p className="text-gray-600 leading-7 mb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
                corrupti dignissimos quos exercitationem placeat hic dolore
                numquam facere sequi? Necessitatibus.
              </p>

              {/* Learn More Button linking to /about */}
              <Link
                to="/about"
                className="bg-teal-500 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-3xl focus:outline-none focus:shadow-outline w-fit border-none inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Service Section */}
          <div className="mt-16">
            <ServicePage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
