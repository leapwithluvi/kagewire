import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#101820",
        surface: {
          main: "#151E27",
          secondary: "#1B2632",
          card: "#18222D",
          hover: "#202D3B",
        },
        amber: {
          DEFAULT: "#D98E04",
          hover: "#E6A51A",
          muted: "rgba(217, 142, 4, 0.12)",
          border: "rgba(217, 142, 4, 0.35)",
        },
        content: {
          primary: "#EDEDED",
          secondary: "#A8B0B8",
          muted: "#737E89",
        },
        border: {
          subtle: "rgba(168, 176, 184, 0.12)",
          highlight: "#222F3E",
        },
        status: {
          error: "#E05252",
          success: "#38A169",
        }
      },
      fontFamily: {
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        subtle: "0 2px 8px rgba(0, 0, 0, 0.25)",
        cinematic: "0 8px 30px rgba(0, 0, 0, 0.4)",
      }
    },
  },
  plugins: [],
};

export default config;
