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
        success: themeColor('success'),
        // Ombre d'élévation des cartes/panneaux : violette en thème sombre, encre en thème clair.
        'shadow-accent': themeColor('shadow-accent'),
        // Encre des bordures épaisses façon neo-brutalism : fixe, ne suit pas le thème.
        ink: '#0B0B16',
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      spacing: {
        touch: '44px',
      },
      borderRadius: {
        card: '0px',
        control: '0px',
        pill: '0px',
      },
      boxShadow: {
        dropdown: '8px 8px 0 rgb(var(--color-shadow-accent))',
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
        'amx-shadow-pulse': {
          '0%, 100%': { boxShadow: '7px 7px 0 #0B0B16' },
          '50%': { boxShadow: '11px 11px 0 #0B0B16' },
        },
      },
      animation: {
        'amx-flash': 'amx-flash 900ms ease-out',
        'amx-pop': 'amx-pop 400ms ease-out',
        'amx-pulse': 'amx-pulse 2.4s ease-in-out infinite',
        'amx-shadow-pulse': 'amx-shadow-pulse 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
