import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta realinhada ao logo oficial da Benvenuto (mascote + bandeira italiana):
        // vermelho-tomate e verde vivos, com preto/grafite como base para dar
        // contraste moderno sem perder o clima caseiro e divertido da marca.
        benvenuto: {
          red: "#D62828",
          "red-dark": "#9C1C1C",
          green: "#158A3E",
          "green-dark": "#0D5C29",
          gold: "#C9A227",
          "gold-light": "#E4C765",
          charcoal: "#17140F",
          black: "#0A0908",
          cream: "#FAF7F0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "grain": "url('/images/texture-grain.svg')",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "flicker": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "flicker": "flicker 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
