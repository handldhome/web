/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F5EF",
        offwhite: "#FAF9F6",
        lightblue: "#E7F0FA",
        navy: "#1E2A53",
        brandBlue: "#2A54A1",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 14px rgba(0,0,0,0.06)",
      },
      spacing: {
        section: "4.5rem",         // ~72px
        sectionTight: "3rem",      // ~48px
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        scroll: "scroll 25s linear infinite",
      },
    },
  },
  plugins: [],
};
