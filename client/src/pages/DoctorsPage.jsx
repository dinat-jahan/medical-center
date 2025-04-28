import React from "react";

const DoctorsPage = () => {
  // Doctor's data object
  const doctor = {
    name: "Dr. Smith",
    specialization: "Cardiologist",
    image:
      "https://www.bing.com/th/id/OIP.YqLbD9qVh6MiK3RyLeCAxwHaEl?w=290&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2", // Using the provided image URL
    phone: "+88 017XXXXXXX",
    email: "smith@example.com",
    address: "123, Medical Street, Dhaka",
  };

  return (
    <div className="flex justify-center pt-20">
      {" "}
      {/* Increased padding-top to pt-20 */}
      {/* Main container for centering the card with border and animation */}
      <div className="max-w-sm bg-white rounded-lg shadow-md border-2 border-gray-300 cursor-pointer transition-transform duration-300 hover:scale-105">
        {" "}
        {/* Increased border width to border-2 and color to border-gray-300 */}
        {/* Image section of the card */}
        <img
          className="rounded-t-lg h-64 w-full object-cover"
          src={doctor.image}
          alt={doctor.name}
        />
        {/* Content section of the card */}
        <div className="p-5">
          {/* Doctor's name */}
          <h5 className="text-2xl font-bold tracking-tight text-gray-900">
            {doctor.name}
          </h5>
          {/* Doctor's specialization */}
          <p className="mb-3 font-normal text-gray-700">
            {doctor.specialization}
          </p>
          {/* Contact information */}
          <div className="flex flex-col space-y-2">
            <p className="text-gray-600">Phone: {doctor.phone}</p>
            <p className="text-gray-600">Email: {doctor.email}</p>
            <p className="text-gray-600">Address: {doctor.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
