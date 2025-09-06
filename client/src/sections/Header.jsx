import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  let mouseTimeout;

  // Handle scroll hide/show
  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // scrolling down → hide
      setVisible(false);
    } else {
      // scrolling up → show
      setVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  // Handle mouse inactivity
  const handleMouseMove = () => {
    setVisible(true); // show when mouse moves
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
      setVisible(false); // hide after inactivity
    }, 2500); // 2.5s inactivity
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`bg-[#122029] text-white shadow-xl fixed top-0 left-0 w-full transition-transform duration-500 z-50 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="flex justify-between p-6">
        {/* Wedding logo text */}
        <div className="font-extrabold text-3xl font-greatVibes text-[#C8692C]">
          <a>Wedding</a>
        </div>
        {/* Navigation links */}
        <div className="space-x-3">
          <Link
            to="/"
            className="text-lg font-semibold hover:text-[#C8692C] transition-colors"
          >
            Home
          </Link>
          <a
            href="#rsvp"
            className="text-lg font-semibold hover:text-[#C8692C] transition-colors"
          >
            RSVP
          </a>
          <Link
            to="/response"
            className="text-lg font-semibold hover:text-[#C8692C] transition-colors"
          >
            Response
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
