/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fff0f3",
        primary: "#ffb6c1",
        secondary: "#ffc0cb",
        accent: "#ff69b4",
        text: "#3d3d3d"
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pink-100': '0 4px 6px -1px rgba(255, 182, 193, 0.2), 0 2px 4px -1px rgba(255, 182, 193, 0.1)',
        'pink-200': '0 10px 15px -3px rgba(255, 182, 193, 0.3), 0 4px 6px -2px rgba(255, 182, 193, 0.15)',
      },
    },
  },
  plugins: [],
}
