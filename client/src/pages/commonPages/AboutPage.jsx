import doctor_standing from "../../assets/doctor_standing.jpg";
import { useState } from "react";

const AboutPage = ({ shortMode = false }) => {
  const [showFull, setShowFull] = useState(false);

  const paragraphs = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum dolorem nesciunt eos fugio minus eveniet ut accusamus distinctio provident autem nemo cumque corporis odio ea ipsum eum quae modi officiis.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi corrupti dignissimos quos exercitationem placeat hic dolore numquam facere sequi? Necessitatibus.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum dolorem nesciunt eos fugio minus eveniet ut accusamus distinctio provident autem nemo cumque corporis odio ea ipsum eum quae modi officiis.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi corrupti dignissimos quos exercitationem placeat hic dolore numquam facere sequi? Necessitatibus.",
  ];

  const visibleParagraphs =
    shortMode && !showFull ? paragraphs.slice(0, 2) : paragraphs;

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

            {visibleParagraphs.map((para, idx) => (
              <p key={idx} className="text-gray-600 leading-7 mb-4">
                {para}
              </p>
            ))}

            {/* Learn More button only for shortMode */}
            {shortMode && !showFull && (
              <button
                type="button"
                className="bg-teal-500 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-3xl focus:outline-none focus:shadow-outline w-fit border-none"
                onClick={() => setShowFull(true)}
              >
                Learn More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
