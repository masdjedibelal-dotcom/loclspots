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
        forest: "#2D4A3E",
        sage: "#5B7F6E",
        mint: "#8FB8A8",
        cream: "#F7F3EE",
        peach: "#D4845A",
        warm: "#EDE8E1",
        gold: "#C9A84C",
        text: "#2A3028",
        muted: "#6B7A6E",
        light: "#FAFAF8",
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.6s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
