import React, { useState } from "react";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  return (
    <>
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#C8692C]"
        >
          Email address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          value={email}
          required
          onChange={handleEmailChange}
          className="mt-2 block w-full rounded-lg border border-[#C8692C]/40 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C8692C] focus:ring-1 focus:ring-[#C8692C]"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#C8692C]"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          value={password}
          required
          onChange={handlePassword}
          className="mt-2 block w-full rounded-lg border border-[#C8692C]/40 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C8692C] focus:ring-1 focus:ring-[#C8692C]"
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          onClick={(e) => handleLogin(e, email, password)}
          className="w-full flex justify-center rounded-lg bg-[#C8692C] px-3 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-[#C8692C]"
        >
          Sign in
        </button>
      </div>
    </>
  );
};

export default Login;
