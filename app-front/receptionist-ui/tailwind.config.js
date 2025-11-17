/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  
  export default {
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        warn: "var(--warn-bg)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};
