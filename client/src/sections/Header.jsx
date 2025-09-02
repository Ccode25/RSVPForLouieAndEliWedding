import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const Header = () => {
  return (
    <header className="bg-[#333333] text-white shadow-xl shadow-[#d4af37]">
      <nav className="flex justify-between p-6">
        {/* Wedding logo text */}
        <div className="font-extrabold text-3xl font-greatVibes text-[#d4af37]">
          <a href="aeronmelnywedding.blog/">Wedding</a>
        </div>
        {/* Navigation links */}
        <div className="space-x-3">
          <Link
            to="/" // Link to home page
            className="text-lg font-semibold hover:text-[#d4af37] transition-colors"
          >
            Home
          </Link>
          <a
            href="#rsvp"
            className="text-lg font-semibold hover:text-[#d4af37] transition-colors"
          >
            RSVP
          </a>

          <Link
            to="/response" // Link to /response route
            className="text-lg font-semibold hover:text-[#d4af37] transition-colors"
          >
            Response
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
