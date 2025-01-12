/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      margin:{
        "m-0-auto" : "0 auto"
      }
    },
  },
  plugins: [],
}

