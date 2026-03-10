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
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],    // 11px
        xs: ["0.75rem", { lineHeight: "1.125rem" }],      // 12px
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],     // 13px
        base: ["0.875rem", { lineHeight: "1.375rem" }],   // 14px
        lg: ["1rem", { lineHeight: "1.5rem" }],           // 16px
        xl: ["1.125rem", { lineHeight: "1.625rem" }],     // 18px
        "2xl": ["1.25rem", { lineHeight: "1.75rem" }],    // 20px
        "3xl": ["1.5rem", { lineHeight: "2rem" }],        // 24px
      },
    },
  },
  plugins: [],
};
export default config;
