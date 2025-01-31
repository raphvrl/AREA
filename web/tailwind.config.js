/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Ajouter des styles d'accessibilité personnalisés
      textColor: {
        high: {
          light: '#000000',
          dark: '#ffffff',
        },
        maximum: {
          light: '#ffffff',
          dark: '#000000',
        },
      },
      backgroundColor: {
        high: {
          light: '#ffffff',
          dark: '#000000',
        },
        maximum: {
          light: '#000000',
          dark: '#ffffff',
        },
      },
      colors: {
        contrast: {
          high: {
            light: '#000000',
            dark: '#ffffff',
          },
          maximum: {
            light: '#ffffff',
            dark: '#000000',
          },
        },
      },
    },
  },
  plugins: [],
};
