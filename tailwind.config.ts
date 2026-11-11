import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17152B",
        muted: "#85849A",
        violet: {
          50: "#F4F0FF",
          100: "#EAE2FF",
          500: "#7954C8",
          600: "#6842B7",
          700: "#513296",
        },
        canvas: "#F6F5FA",
      },
      boxShadow: { soft: "0 12px 40px rgba(35, 25, 75, .06)" },
      borderRadius: { "2xl": "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
