import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#fbf7ef",
          100: "#f1e7d2",
          200: "#e2cfaa",
          300: "#d4b57d",
          400: "#c69d58",
          500: "#ab7c3b"
        },
        ink: {
          900: "#1f1a17"
        }
      },
      fontFamily: {
        display: ["var(--font-cormorant)"],
        sans: ["var(--font-manrope)"]
      },
      boxShadow: {
        card: "0 24px 60px rgba(15, 23, 42, 0.18)",
        page: "0 18px 50px rgba(17, 24, 39, 0.15)"
      },
      backgroundImage: {
        "paper-grid":
          "linear-gradient(rgba(120, 113, 108, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 113, 108, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
