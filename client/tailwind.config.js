/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        poetsen: ["Poetsen One", "cursive"],
      },
      colors: {
        primary: "#A31D1D",
      
      },
    },
  },
  plugins: [daisyui],
};
