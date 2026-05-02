/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        cyan_brand: "#0093c9",
        navy: "#2c3e50",
        navy_deep: "#004965",
        ink: "#0f172a",
        bone: "#f5f1ea",
        cream: "#faf7f2",
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"Clash Display"', "Inter", "sans-serif"],
        body: ['"Satoshi"', "Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
