/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        handldCream: '#f7f7f3',
        handldBlue: '#e8f4fb',
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};
