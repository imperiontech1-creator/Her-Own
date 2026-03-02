import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FAFAFA",
        blush: "#F8E1E9",
        "rose-gold": "#D4A574",
        text: "#1A1A1A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-fraunces)", "var(--font-inter)", "serif"],
      },
      backgroundImage: {
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(248,225,233,0.15) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "rose-shine": "rose-shine 3s ease-in-out infinite",
      },
      keyframes: {
        "rose-shine": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
