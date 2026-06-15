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
        brand: {
          navBg: "#1e2e1a",
          sectionGreen: "#2d5228",
          greenLight: "#4a7a42",
          rust: "#b8541e",
          rustHover: "#9e4518",
          base: "#f5f1ea",
          surface: "#ffffff",
          textPrimary: "#1e2e1a",
          textMuted: "rgba(30,46,26,0.5)",
          textOnDark: "#f5f1ea",
          border: "rgba(30,46,26,0.08)",
          borderOnDark: "rgba(245,241,234,0.15)",
        },
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        condensed: ["Barlow Condensed", "sans-serif"],
        body: ["Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
