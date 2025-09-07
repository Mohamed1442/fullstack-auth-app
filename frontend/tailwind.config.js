/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f0754d",
        secondary: "#ffd391",
        error: "#D80027",
      },
    },
  },
  plugins: [],
};
