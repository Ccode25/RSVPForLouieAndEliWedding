export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        greatVibes: ["Great Vibes", "cursive"],
        mtbell: ["MT Bell", "serif"], // ✅ Added MT Bell font
      },
      boxShadow: {
        "header-shadow": "0 4px 15px rgba(212, 175, 55, 0.6)",
      },
    },
  },
  plugins: [],
};
