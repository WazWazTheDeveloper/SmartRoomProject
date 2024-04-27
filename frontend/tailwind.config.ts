import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode:"selector",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors : {
        "neutral-0" : "#FFFFFF",
        "neutral-100" : "#F7F8F9",
        "neutral-200" : "#F1F2F4",
        "neutral-300" : "#DCDFE4",
        "neutral-400" : "#B3B9C4",
        "neutral-500" : "#8590A2",
        "neutral-600" : "#758195",
        "neutral-700" : "#626F86",
        "neutral-800" : "#44546F",
        "neutral-900" : "#2C3E5D",
        "neutral-1000" : "#172B4D",
        "neutral-1100" : "#091E42",
        "darkNeutral--100" : "#101214",
        "darkNeutral-0" : "##161A1D",
        "darkNeutral-100" : "#1D2125",
        "darkNeutral-200" : "#22272B",
        "darkNeutral-250" : "#282E33",
        "darkNeutral-300" : "#2C333A",
        "darkNeutral-350" : "#38414A",
        "darkNeutral-400" : "#454F59",
        "darkNeutral-500" : "#596773",
        "darkNeutral-600" : "#738496",
        "darkNeutral-700" : "#8C9BAB",
        "darkNeutral-800" : "#9FADBC",
        "darkNeutral-900" : "#B6C2CF",
        "darkNeutral-1000" : "#C7D1DB",
        "darkNeutral-1100" : "#DEE4EA",
      }
    }
  },
  plugins: [],
};
export default config;
