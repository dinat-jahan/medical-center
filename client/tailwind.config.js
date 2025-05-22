/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        poetsen: ["Poetsen One", "cursive"],
      },
      colors: {
        primary: "#A31D1D", // Custom primary color
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false, // Disable default DaisyUI themes to avoid errors
  },
};
