/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-red": "#f2f2f2",
        "custom-green": "#6dadab", // aggiungi il tuo colore personalizzato qui
      },
    },
  },
  plugins: [],
};
