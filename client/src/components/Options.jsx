import React from "react";

const Options = () => {
  return (
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
  );
};

export default Options;
