import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Neon cyberpunk palette
        neon: {
          cyan: '#00f5ff',
          purple: '#bf00ff',
          yellow: '#ffff00',
          pink: '#ff007f',
          green: '#00ff80',
          gold: '#ffd700',
        },
        // Dark background scale
        void: {
          950: '#020208',
          900: '#050510',
          800: '#08081a',
          700: '#0d0d24',
          600: '#13132e',
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'combo-pop': 'comboPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.7', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        comboPop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00f5ff, 0 0 30px #00f5ff40',
        'neon-purple': '0 0 10px #bf00ff, 0 0 30px #bf00ff40',
        'neon-pink': '0 0 10px #ff007f, 0 0 30px #ff007f40',
        'neon-gold': '0 0 10px #ffd700, 0 0 30px #ffd70040',
        'inner-glow': 'inset 0 0 20px rgba(0, 245, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
