import doctor_standing from "../../assets/doctor_standing.jpg";
import { useState } from "react";

const AboutPage = ({ shortMode = false }) => {
  const [showFull, setShowFull] = useState(false);

  const paragraphs = [
    "The Medical Center at Mawlana Bhashani Science and Technology University (MBSTU) provides basic healthcare services to the university community — including students, faculty members, and administrative staff. Situated within the campus, the center primarily offers free consultations and limited free medication for students, while faculty and staff members can access medical consultations and purchase prescribed medicines as needed.",
    "Though modest in size and resources, the center plays a key role in addressing day-to-day health needs of the campus population.",

    "The Medical Center operates under the supervision of several medical officers, supported by nurses, attendants, and administrative staff. Healthcare services are generally available in two shifts (Morning & Evening), based on a weekly duty roster. Telemedicine support is also available for basic consultations, with doctors reachable by phone on specific days.",

    "🧪 Available Services", // We'll render this as heading before the list
  ];

  const services = [
    "General consultation",
    "Basic first aid",
    "Limited free medicine (students only)",
    "Pathology services: blood tests, X-rays, ultrasonography (subject to availability)",
    "Emergency services",
    "Ambulance facility (on-call)",
    "Telemedicine support via mobile",
  ];

  const visibleParagraphs =
    shortMode && !showFull ? paragraphs.slice(0, 2) : paragraphs;

  return (
    <div className="bg-teal-50 pt-20 pb-10 px-4 md:px-12 mx-auto min-h-screen">
      <div className="container mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row justify-center md:items-start gap-8">
          {/* Sticky Doctor Image */}
          <div className="hidden md:block md:w-[40%] md:mr-8 sticky top-28 self-start">
            <img
              src={doctor_standing}
              alt="Our Doctors"
              className="w-full h-auto object-contain rounded-xl shadow-lg"
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

            {visibleParagraphs.map((para, idx) =>
              para === "🧪 Available Services" ? (
                <div key={idx} className="mb-4">
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    🧪 Available Services
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    {services.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p
                  key={idx}
                  className="text-gray-600 leading-7 mb-4 whitespace-pre-wrap"
                >
                  {para}
                </p>
              )
            )}

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
