import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0907",
          50: "#1A1714",
          100: "#14110D",
          200: "#0E0C09",
          900: "#050402",
        },
        bone: {
          DEFAULT: "#F5F1EA",
          dim: "#C9C2B5",
          mute: "#8A8278",
        },
        line: {
          DEFAULT: "#2A2723",
          soft: "#1D1A16",
        },
        swamp: {
          orange: "#FA4616",
          orangeDim: "#B83A1B",
          cyan: "#69E0FF",
          cyanDim: "#3A9EBA",
          moss: "#1F2A1E",
          rust: "#3D1607",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tightish: "-0.02em",
        wide2: "0.18em",
        wide3: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
