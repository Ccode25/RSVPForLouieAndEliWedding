import React from "react";

const Button = ({ label, onClick }) => {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        className="w-full md:w-64 py-3 text-base font-semibold text-white rounded-full shadow-md 
                   bg-gradient-to-r from-[#C8692C] to-[#a0521f]
                   transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
