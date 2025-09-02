import React, { useState, useEffect } from "react";
import HeroDesktop from "../components/HeroDesktop";
import HeroMobile from "../components/HeroMobile";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the screen is mobile size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    // Add event listener for resizing
    window.addEventListener("resize", handleResize);

    // Check initial screen size
    handleResize();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <>{isMobile ? <HeroMobile /> : <HeroDesktop />}</>;
};

export default Hero;
