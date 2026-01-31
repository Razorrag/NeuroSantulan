/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        'purple-blue': {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        beige: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        border: 'hsl(var(--border))',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f97316 0%, #6366f1 50%, #4f46e5 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #fb923c 0%, #818cf8 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fdba74 0%, #f97316 50%, #ea580c 100%)',
        'gradient-cool': 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #4f46e5 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(249, 115, 22, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(99, 102, 241, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(251, 146, 60, 0.2) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(129, 140, 248, 0.2) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(249, 115, 22, 0.2) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(99, 102, 241, 0.2) 0px, transparent 50%)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
