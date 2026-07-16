/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: "#F5F5FA",        // app background (cool light gray)
        surface: "#FFFFFF",     // card surface
        ink: "#15112B",         // near-black text
        brand: {
          DEFAULT: "#5B21B6",   // electric violet (primary / Zepto-esque)
          light: "#7C3AED",
          dark: "#3E1680",
          50: "#F3EBFF",
        },
        accent: {
          DEFAULT: "#FF3D71",   // hot pink/magenta (CTA)
          light: "#FF6B93",
          dark: "#D91C57",
        },
        teal: {
          DEFAULT: "#0EA5A0",   // trust teal (Urban-Company-esque)
          light: "#3FC6BF",
          dark: "#0A7B76",
          50: "#E6F9F7",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(21,17,43,0.04), 0 8px 24px -8px rgba(21,17,43,0.10)",
        pop: "0 12px 32px -12px rgba(91,33,182,0.35)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #5B21B6 0%, #7C3AED 55%, #FF3D71 130%)",
      },
    },
  },
  plugins: [],
};
