import React from "react";
import img from "../assets/background.jpg";
import { FaHeart, FaEnvelope, FaUser } from "react-icons/fa";

const RSVPForm = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Form Content */}
      <div className="relative z-10 w-full max-w-4xl text-white px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide">
            You're Invited
          </h1>
          <p className="text-lg md:text-2xl mt-4">
            Join us for our special day. Kindly RSVP below.
          </p>
        </div>

        <form className="space-y-8">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-white"
            >
              Full Name
            </label>
            <div className="mt-2 flex items-center border-b-2 border-white focus-within:border-pink-500 transition-colors duration-200">
              <FaUser className="text-white mr-2" />
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-white"
            >
              Email Address
            </label>
            <div className="mt-2 flex items-center border-b-2 border-white focus-within:border-pink-500 transition-colors duration-200">
              <FaEnvelope className="text-white mr-2" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* RSVP Options */}
          <div>
            <p className="text-lg font-medium">Will you attend?</p>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  className="accent-pink-500"
                />
                <span className="text-white">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  className="accent-pink-500"
                />
                <span className="text-white">No</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
            >
              Send RSVP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;
import React from "react";
import img from "../assets/background.jpg";
import { FaHeart, FaEnvelope, FaUser } from "react-icons/fa";

const RSVPForm = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Form Content */}
      <div className="relative z-10 w-full max-w-4xl text-white px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide">
            You're Invited
          </h1>
          <p className="text-lg md:text-2xl mt-4">
            Join us for our special day. Kindly RSVP below.
          </p>
        </div>

        <form className="space-y-8">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-white"
            >
              Full Name
            </label>
            <div className="mt-2 flex items-center border-b-2 border-white focus-within:border-pink-500 transition-colors duration-200">
              <FaUser className="text-white mr-2" />
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-white"
            >
              Email Address
            </label>
            <div className="mt-2 flex items-center border-b-2 border-white focus-within:border-pink-500 transition-colors duration-200">
              <FaEnvelope className="text-white mr-2" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* RSVP Options */}
          <div>
            <p className="text-lg font-medium">Will you attend?</p>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  className="accent-pink-500"
                />
                <span className="text-white">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  className="accent-pink-500"
                />
                <span className="text-white">No</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
            >
              Send RSVP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;
