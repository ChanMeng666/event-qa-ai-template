/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  safelist: [
    // Stagger shadow variants
    'shadow-stagger',
    'shadow-stagger-sm',
    'shadow-stagger-lg',
    'shadow-stagger-primary',
    'shadow-stagger-sm-primary',
    'shadow-stagger-lg-primary',
    'shadow-stagger-hover',
    // Hover/Focus variants
    'hover:shadow-stagger-sm-primary',
    'hover:shadow-stagger-primary',
    'focus:shadow-stagger-primary',
    'focus-within:shadow-stagger-primary',
    // Sci-Fi utilities
    'glass',
    'glass-strong',
    'glass-dark',
    'glow',
    'glow-sm',
    'glow-lg',
    'text-glow',
    'text-shine',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Orbitron', 'sans-serif'],
        primary: ['var(--font-primary)', 'Space Grotesk', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Sci-Fi specific colors
        scifi: {
          bg: '#050505',
          'bg-secondary': '#0a0a0a',
          border: 'rgba(255, 255, 255, 0.1)',
          'border-hover': 'rgba(255, 255, 255, 0.4)',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'organic': '32px 20px 32px 28px',
        'organic-sm': '20px 12px 20px 16px',
      },
      boxShadow: {
        // Small size - for small buttons, tags, badges
        'stagger-sm': '0px 4px 0px 2px hsl(var(--border))',
        'stagger-sm-primary': '0px 4px 0px 2px hsl(var(--primary))',
        // Default size - for regular buttons, cards
        'stagger': '0px 8px 0px 4px hsl(var(--border))',
        'stagger-primary': '0px 8px 0px 4px hsl(var(--primary))',
        'stagger-hover': '0px 12px 0px 4px hsl(var(--border))',
        // Large size - for dialogs, large cards
        'stagger-lg': '0px 12px 0px 6px hsl(var(--border))',
        'stagger-lg-primary': '0px 12px 0px 6px hsl(var(--primary))',
        // Sci-Fi glow shadows
        'glow-sm': '0 0 10px rgba(255, 255, 255, 0.1)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.15)',
        'glow-lg': '0 0 40px rgba(255, 255, 255, 0.2)',
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.3)',
        'scifi': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'scifi-lg': '0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      rotate: {
        'stagger-1': '-2.5deg',
        'stagger-2': '2.5deg',
        'stagger-3': '-1deg',
        'stagger-4': '1deg',
      },
      translate: {
        'stagger-up': '-15px',
        'stagger-down': '15px',
      },
      letterSpacing: {
        'scifi': '0.5rem',
        'scifi-lg': '1rem',
        'scifi-xl': '1.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "shine": {
          to: { backgroundPosition: "200% center" },
        },
        "orbFloat": {
          from: { transform: "translateY(0) scale(1.0)" },
          to: { transform: "translateY(-15px) scale(1.05)" },
        },
        "diskSpin": {
          from: { transform: "rotateZ(0deg)" },
          to: { transform: "rotateZ(360deg)" },
        },
        "pulseRing": {
          "0%": { opacity: "0.5", transform: "translate(-50%, -50%) scale(1)" },
          "100%": { opacity: "1", transform: "translate(-50%, -50%) scale(1.05)" },
        },
        "photonPulse": {
          "0%, 100%": { boxShadow: "0 0 15px #fff, 0 0 30px rgba(255, 255, 255, 0.3)", opacity: "0.9" },
          "50%": { boxShadow: "0 0 20px #fff, 0 0 40px rgba(255, 255, 255, 0.5)", opacity: "1" },
        },
        "decoderSweep": {
          "0%": { left: "-100%" },
          "50%": { left: "100%" },
          "100%": { left: "100%" },
        },
        "titleReveal": {
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "auraPulse": {
          from: { opacity: "0.3", transform: "translate(-50%, -50%) scale(1)" },
          to: { opacity: "0.8", transform: "translate(-50%, -50%) scale(1.2)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shine": "shine 12s linear infinite",
        "orb-float": "orbFloat 4s ease-in-out infinite alternate",
        "disk-spin": "diskSpin 20s linear infinite",
        "pulse-ring": "pulseRing 6s ease-in-out infinite alternate",
        "photon-pulse": "photonPulse 3s ease-in-out infinite",
        "decoder-sweep": "decoderSweep 3s infinite",
        "title-reveal": "titleReveal 0.8s ease-out forwards",
        "aura-pulse": "auraPulse 8s ease-in-out infinite alternate",
      },
      transitionTimingFunction: {
        'scifi': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'scifi-smooth': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
