/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        sky: "var(--sky)",
        "sky-light": "var(--sky-light)",
        navy: "var(--navy)",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
