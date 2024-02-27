import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        wifiads: {
          primary: "#f2d06a",
          secondary: "#e2d371",
          accent: "#9680f7",
          neutral: "#242e38",
          "base-100": "#ffffff",
          info: "#4fc9e8",
          success: "#20924a",
          warning: "#fad66b",
          error: "#f23658",
        },
      },
      "dark",
    ],
  },
  plugins: [require("daisyui")],
} satisfies Config;
