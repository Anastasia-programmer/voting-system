import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Layered dark surfaces.
        ink: {
          950: "#05060d", // app background (near-black)
          900: "#0a0d1a", // section background
          800: "#10142a", // base card
          700: "#161b36", // raised card
          600: "#1d2342", // hover surface
          500: "#272d54", // border subtle
        },
        // Electric blue / violet primary spectrum.
        primary: {
          50:  "#eef2ff",
          100: "#dde4ff",
          200: "#b9c5ff",
          300: "#8a9bff",
          400: "#5b73ff",
          500: "#3b50ff", // main electric blue
          600: "#2e3eff",
          700: "#2530d4",
          800: "#1d28a8",
          900: "#161e7a",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        // Neon accents for status.
        neon: {
          cyan:    "#22d3ee",
          blue:    "#3b82f6",
          violet:  "#a78bfa",
          green:   "#22c55e",
          lime:    "#a3e635",
          rose:    "#fb7185",
          red:     "#ef4444",
          amber:   "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "grid":
          "linear-gradient(to right, rgba(139,160,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,160,255,.08) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(800px 400px at 50% 0%, rgba(91,115,255,.18), transparent 60%)",
        "primary-gradient":
          "linear-gradient(135deg, #3b50ff 0%, #8b5cf6 50%, #22d3ee 100%)",
        "danger-gradient":
          "linear-gradient(135deg, #ef4444 0%, #fb7185 100%)",
        "success-gradient":
          "linear-gradient(135deg, #22c55e 0%, #22d3ee 100%)",
      },
      boxShadow: {
        "glow-sm":   "0 0 16px rgba(91,115,255,.35)",
        "glow":      "0 0 32px rgba(91,115,255,.45), 0 0 4px rgba(91,115,255,.6)",
        "glow-lg":   "0 0 64px rgba(91,115,255,.5), 0 0 8px rgba(167,139,250,.6)",
        "glow-violet":"0 0 32px rgba(139,92,246,.55)",
        "glow-cyan": "0 0 32px rgba(34,211,238,.55)",
        "glow-green":"0 0 32px rgba(34,197,94,.55)",
        "glow-red":  "0 0 32px rgba(239,68,68,.55)",
        "card":      "0 12px 40px -12px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04)",
        "card-hover":"0 24px 60px -12px rgba(59,80,255,.25), inset 0 1px 0 rgba(255,255,255,.06)",
        "inset-glow":"inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.4)",
      },
      keyframes: {
        "fade-in":   { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "slide-in":  { "0%": { opacity: "0", transform: "translateX(12px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        "pulse-ring":{ "0%": { transform: "scale(.8)", opacity: ".7" }, "100%": { transform: "scale(2.2)", opacity: "0" } },
        "glow-pulse":{ "0%,100%": { boxShadow: "0 0 24px rgba(91,115,255,.45)" }, "50%": { boxShadow: "0 0 48px rgba(139,92,246,.7)" } },
        "shimmer":   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "scan":      { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        "float":     { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        "blink":     { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: ".25" } },
        "gradient-shift": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
      },
      animation: {
        "fade-in":      "fade-in .5s ease-out both",
        "slide-in":     "slide-in .4s ease-out both",
        "pulse-ring":   "pulse-ring 1.6s ease-out infinite",
        "glow-pulse":   "glow-pulse 2.4s ease-in-out infinite",
        "shimmer":      "shimmer 2.4s linear infinite",
        "scan":         "scan 2.8s ease-in-out infinite",
        "float":        "float 4s ease-in-out infinite",
        "blink":        "blink 1.2s step-end infinite",
        "gradient-shift":"gradient-shift 6s ease infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
