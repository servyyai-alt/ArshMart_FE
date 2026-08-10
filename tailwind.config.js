/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f9e9',
          100: '#e4f3cc',
          200: '#c9e79e',
          300: '#a9d66b',
          400: '#8bc34a',
          500: '#7cb342',
          600: '#689f38',
          700: '#558b2f',
          800: '#446c28',
          900: '#375a22',
        },
        amber: {
          50: '#f2f9e9',
          100: '#e4f3cc',
          200: '#c9e79e',
          300: '#a9d66b',
          400: '#8bc34a',
          500: '#7cb342',
          600: '#689f38',
          700: '#558b2f',
          800: '#446c28',
          900: '#375a22',
          950: '#1f3311',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(124,179,66,0.4)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(124,179,66,0.2)' },
        }
      }
    },
  },
  plugins: [],
}
