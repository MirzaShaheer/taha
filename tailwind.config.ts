import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-neutral obsidian — true premium black, only a whisper of warmth
        // so it reads black (not brown/yellow) under the gold accents.
        ink: {
          950: "#060606", // page background
          900: "#0C0C0D", // panels / cards
          800: "#151517", // elevated surfaces
          700: "#202023", // hairline borders
          600: "#2E2E33", // icon wells / strong borders
        },
        // Majestic, neon-rich gold — amber-leaning (more red, less green) so it
        // reads as molten gold, never lemon-yellow. Saturated + glowing on black.
        gold: {
          DEFAULT: "#E3A81C",
          50: "#FBF2D3",
          100: "#F6DF97",
          200: "#F2C84A", // bright amber highlight (for metallic gradients)
          300: "#EDB933",
          400: "#E3A81C", // primary "majestic neon" gold
          500: "#CE9417",
          600: "#A2730F",
          700: "#79560B",
        },
        champagne: "#F2CB5B",
        // Cooled, near-white text so large copy no longer reads yellow.
        cream: {
          DEFAULT: "#F4F4F2",
          dim: "#D7D7D4",
        },
        slatey: "#8E8E96",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(227,168,28,0.3), 0 20px 60px -20px rgba(227,168,28,0.55)",
        soft: "0 24px 60px -24px rgba(0,0,0,0.9)",
        luxe: "0 30px 80px -30px rgba(0,0,0,0.95), 0 0 0 1px rgba(227,168,28,0.14)",
        "gold-glow":
          "0 0 30px -2px rgba(227,168,28,0.6), 0 0 70px -12px rgba(227,168,28,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Slow pan used for animated gilt text + gradient borders.
        "gold-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        // A specular highlight sweeping across a surface.
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-12deg)", opacity: "0" },
          "12%": { opacity: "0.7" },
          "55%": { opacity: "0.7" },
          "100%": { transform: "translateX(220%) skewX(-12deg)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        // Ambient glow that breathes behind hero / sections.
        "glow-breathe": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.08)" },
        },
        // Loader: front cover swings open on its spine.
        "book-open": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(-168deg)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        shimmer: "shimmer 6s linear infinite",
        "gold-pan": "gold-pan 6s ease-in-out infinite",
        sheen: "sheen 5.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        "glow-breathe": "glow-breathe 7s ease-in-out infinite",
        "rise-in": "rise-in 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
