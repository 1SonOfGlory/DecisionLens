/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FA', // Soft off-white
        surface: '#ffffff',
        border: '#e5e7eb',
        primary: '#111827',
        secondary: '#6b7280',
        accent: '#4f46e5', // Deep Violet / Indigo
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
