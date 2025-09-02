import React from "react";

const RsvpHeader = () => {
  return (
    <div className="text-center mb-12">
      {/* Heading with Caligraphy Font */}
      <h1 className="text-5xl md:text-6xl font-extrabold font-greatVibes tracking-wide leading-tight">
        You're Invited
      </h1>
      <p className="text-lg md:text-2xl mt-4">
        Join us for our special day. Kindly confirm your attendance below.
      </p>
    </div>
  );
};

export default RsvpHeader;
