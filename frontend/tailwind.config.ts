import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B76E79",
          dark: "#9A4C5A",
        },
        secondary: "#FFF8F0",
        accent: "#D4A853",
        dark: "#2D2D2D",
        medium: "#6B6B6B",
        light: "#FAF5F0",
        border: "#F0E0D6",
        success: "#6B9E78",
        error: "#D94F4F",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
