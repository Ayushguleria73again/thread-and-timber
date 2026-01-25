import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A1A",
        sand: "#F6F2EC",
        clay: "#E7D9C9",
        moss: "#5C6B5B"
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        soft: "0 16px 40px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

export default config;

