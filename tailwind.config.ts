import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        serif: ['var(--font-serif)', 'serif'],
      },
      colors: {
        paper: '#ece8de',
        bone: '#f5f1e6',
        ink: '#0e0e0c',
        ash: '#7a766c',
        rust: '#c8331f',
        moss: '#5a6b3b',
        sky: '#5b7a96',
        ochre: '#c79a3a',
      },
      letterSpacing: {
        tightest: '-0.06em',
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.6, 0.01, 0.05, 0.95)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'ticker': 'ticker 40s linear infinite',
        'ticker-slow': 'ticker 90s linear infinite',
        'ticker-reverse': 'ticker-reverse 50s linear infinite',
        'blink': 'blink 1.2s step-end infinite',
        'drift': 'drift 14s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'ticker-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        drift: {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '50%': { transform: 'translate(8px,-6px) rotate(0.4deg)' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-5%,-10%)' },
          '20%': { transform: 'translate(-15%,5%)' },
          '30%': { transform: 'translate(7%,-25%)' },
          '40%': { transform: 'translate(-5%,25%)' },
          '50%': { transform: 'translate(-15%,10%)' },
          '60%': { transform: 'translate(15%,0%)' },
          '70%': { transform: 'translate(0%,15%)' },
          '80%': { transform: 'translate(3%,35%)' },
          '90%': { transform: 'translate(-10%,10%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
