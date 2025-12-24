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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
