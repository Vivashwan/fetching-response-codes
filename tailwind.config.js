/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        offwhite: '#f9f9f9', // or use another soft shade like '#f8f8f8'
      },
    },
  },
  plugins: [],
}