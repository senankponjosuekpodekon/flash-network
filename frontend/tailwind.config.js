/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        flash: {
          50: "#eef9ff",
          100: "#d9f1ff",
          200: "#bce7ff",
          300: "#8ed8ff",
          400: "#59c0ff",
          500: "#33a4ff",
          600: "#1c85f5",
          700: "#146ae1",
          800: "#1656b6",
          900: "#184b8f",
          950: "#122d57",
        },
      },
    },
  },
  plugins: [],
};
