import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaMapMarkerAlt,
  FaChurch,
  FaRegCalendarAlt,
} from "react-icons/fa"; // Importing icons
import bgDetails from "../assets/backgroundDetails.jpg"; // Importing your background image

const EventDetails = () => {
  const weddingDate = new Date("May 17, 2025").getTime();
  const [countdown, setCountdown] = useState("");

  // Countdown Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      // Calculate time remaining
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      if (distance < 0) {
        clearInterval(interval);
        setCountdown("Wedding day has arrived!");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="details"
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center py-12 sm:py-16 lg:py-20"
      style={{
        backgroundImage: `url(${bgDetails})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 w-full max-w-5xl text-white px-4 sm:px-6 lg:px-12 mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-greatVibes tracking-wide leading-tight mb-4 sm:mb-6">
            Wedding Details
          </h2>
        </div>

        <div className="bg-white bg-opacity-75 rounded-lg shadow-xl p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Countdown Timer */}
          <div className="mb-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <FaClock className="text-3xl sm:text-4xl text-[#d4af37]" />
            <div className="flex flex-col items-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl text-[#d4af37] font-semibold mb-1 whitespace-nowrap">
                Countdown to the Big Day
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-green-800 text-center">
                {countdown}
              </p>
            </div>
          </div>

          {/* Wedding Information */}
          <div className="space-y-6 text-center">
            <h3 className="text-lg sm:text-xl lg:text-2xl text-[#d4af37] font-semibold">
              Wedding Information
            </h3>

            {/* Ceremony */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <FaChurch className="text-3xl sm:text-4xl text-[#d4af37]" />
              <p className="text-base sm:text-lg lg:text-xl text-green-800">
                Ceremony: Mount Carmel Shrine
              </p>
            </div>

            {/* Date */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <FaRegCalendarAlt className="text-3xl sm:text-4xl text-[#d4af37]" />
              <p className="text-base sm:text-lg lg:text-xl text-green-800">
                Date: May 17, 2025
              </p>
            </div>

            {/* Location */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <FaMapMarkerAlt className="text-3xl sm:text-4xl text-[#d4af37]" />
              <p className="text-base sm:text-lg lg:text-xl text-green-800">
                Location: Stalla Suites Events Place
              </p>
            </div>

            {/* Time */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <FaRegCalendarAlt className="text-3xl sm:text-4xl text-[#d4af37]" />
              <p className="text-base sm:text-lg lg:text-xl text-green-800">
                Time: 12:30 PM
              </p>
            </div>

            {/* Dress Code */}
            <p className="text-base sm:text-lg lg:text-xl text-green-800">
              Dress Code: Semi-Formal Attire
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-green-800">
              Please RSVP by April 20, 2025
            </p>
          </div>

          {/* RSVP Button */}
          <div className="text-center mt-4 sm:mt-6 lg:mt-8">
            <a href="#rsvp">
              <button className="py-3 px-8 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm sm:text-base lg:text-lg font-bold rounded-lg transition-transform transform hover:scale-105">
                RSVP Now
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
