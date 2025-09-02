import React from "react";

const InputForm = ({
  details,
  icon: Icon,
  placeholder,
  type,
  id,
  htmlFor,
  value,
  onChange,
  readOnly,
  className,
}) => {
  return (
    <div className="mb-4">
      {/* Label */}
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-gray-200 mb-2"
      >
        {details}
      </label>

      {/* Input with icon */}
      <div className="flex items-center bg-white/10 border border-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#C8692C] transition duration-300">
        {Icon && <Icon className="text-gray-300 mr-3 text-lg" />}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className={`flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none ${className}`}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default InputForm;
