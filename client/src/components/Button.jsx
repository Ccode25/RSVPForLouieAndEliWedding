import React from "react";

const Button = ({ label, onClick }) => {
  return (
    <div>
      <button
        type="button"
        className="w-full py-3 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
        style={{ backgroundColor: "#C8692C" }}
        onClick={onClick}
      >
        {" "}
        {label}{" "}
      </button>
    </div>
  );
};

export default Button;
