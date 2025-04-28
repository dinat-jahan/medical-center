import { Link } from "react-router-dom";
import doctor_standing from "../assets/doctor_standing.jpg";
import ServicePage from "./ServicePage";

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
        <div className="text-center text-white px-4 py-8 relative z-10 flex items-center justify-center h-full w-full">
          <div className="text-4xl md:text-5xl font-bold leading-snug">
            Welcome to
            <br className="md:hidden" />
            <span className="text-red-700 drop-shadow-lg"> MBSTU </span>
            <br className="md:hidden" />
            Medical Center
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-white py-10 px-4 md:px-12">
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
              <h2 className="text-4xl font-poetsen text-primary mt-1 max-md:text-center mb-4">
                ABOUT US
              </h2>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 leading-relaxed">
                We Take Care Of Your Healthy Life
              </h3>
              <p className="text-gray-600 leading-7 mb-4">
                Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Dolorum
                Dolorem Nesciunt Eos Fugio Minus Eveniet Ut Accusamus Distinctio
                Provident Autem Nemo Cumque Corporis Odio Ea Ipsum Eum Quae Modi
                Officiis.
              </p>
              <p className="text-gray-600 leading-7">
                Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Modi
                Corrupti Dignissimos Quos Exercitationem Placeat Hic Dolore
                Numquam Facere Sequi? Necessitatibus.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all duration-300 mt-6">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ServicePage />
      </div>
    </div>
  );
};

export default IndexPage;
