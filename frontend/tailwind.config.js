/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Dark theme palette
        background: '#0f172a', // Slate 900
        surface: '#1e293b',    // Slate 800
        surfaceHover: '#334155', // Slate 700
        primary: '#6366f1',    // Indigo 500
        primaryHover: '#4f46e5', // Indigo 600
        secondary: '#64748b',  // Slate 500
        success: '#22c55e',    // Green 500
        danger: '#ef4444',     // Red 500
        warning: '#f59e0b',    // Amber 500
        text: {
          primary: '#f8fafc',   // Slate 50
          secondary: '#94a3b8', // Slate 400
          muted: '#64748b',     // Slate 500
        },
        border: '#334155',      // Slate 700
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
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
      },
    },
  },
  plugins: [],
}
