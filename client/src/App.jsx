import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import RSVPForm from "./sections/RSVPForm";
import EventDetails from "./sections/EventDetails";
import Response from "./sections/Response";

// Component to handle scroll blocking based on route
const ScrollControl = () => {
  const location = useLocation();

  useEffect(() => {
    // Example: disable scroll on /response page
    if (location.pathname === "/response") {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset when unmounting
    };
  }, [location]);

  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollControl /> {/* Scroll behavior controller */}
      <div className="scroll-smooth">
        <Routes>
          <Route
            path="/"
            element={
              <div id="rsvp" className="py-0 mb-0 shadow-lg shadow-[#d4af37]">
                <RSVPForm />
              </div>
            }
          />
          <Route path="/response" element={<Response />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
