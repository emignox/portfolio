/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', '"Inter"', "sans-serif"],
      },
      colors: {
        "custom-red": "#f2f2f2",
        "custom-green": "#6dadab", // aggiungi il tuo colore personalizzato qui
        "custom-blue": "#012836",
      },
    },
  },
  plugins: [],
};
