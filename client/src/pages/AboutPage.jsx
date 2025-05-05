// src/pages/AboutPage.jsx
import doctor_standing from "../assets/doctor_standing.jpg";

const AboutPage = () => {
  return (
    <div className="bg-teal-50 pt-20 pb-10 px-4 md:px-12 mx-auto min-h-screen">


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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
