/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'railway-indigo': '#6366F1',
        'railway-purple': '#8B5CF6',
        'railway-blue': '#3B82F6',
      },
    },
  },
  plugins: [],
};