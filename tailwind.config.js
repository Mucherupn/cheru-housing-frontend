/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#012169",
        body: "#0B1220",
        secondary: "#4B5563",
      },
    },
  },
  plugins: [],
};
