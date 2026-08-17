import type { Config } from 'tailwindcss';

function themeColor(name: string) {
  return `rgb(var(--color-${name}) / <alpha-value>)`;
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: themeColor('bg'),
        surface: themeColor('surface'),
        text: themeColor('text'),
        brand: themeColor('brand'),
        'brand-dark': themeColor('brand-dark'),
        'brand-mid': themeColor('brand-mid'),
        muted: themeColor('muted'),
        border: themeColor('border'),
        danger: themeColor('danger'),
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        logo: ['Urbanist', 'sans-serif'],
      },
      spacing: {
        touch: '44px',
      },
      borderRadius: {
        card: '12px',
        control: '8px',
        pill: '16px',
      },
      boxShadow: {
        dropdown: '0 12px 32px rgba(26,26,46,.12)',
      },
      keyframes: {
        'amx-flash': {
          '0%': { backgroundColor: `rgb(var(--color-flash))` },
          '100%': { backgroundColor: `rgb(var(--color-surface))` },
        },
        'amx-pop': {
          '0%': { transform: 'scale(.94)', opacity: '0' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'amx-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        'amx-flash': 'amx-flash 900ms ease-out',
        'amx-pop': 'amx-pop 400ms ease-out',
        'amx-pulse': 'amx-pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
