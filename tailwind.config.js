/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-dark-blue": "#002147",
        "custom-orange": "#FF8C00",
        "custom-hover-blue": "#003366",
        "custom-light-orange": "#FFF4EC",
      },
      backgroundImage: {
        "custom-gradient-button":
          "linear-gradient(to right, #FFF4EC, #FFFFFF, #FF7B1D)",
      },
    },
  },
  plugins: [],
};
