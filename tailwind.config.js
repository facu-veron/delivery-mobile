/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // --- Backgrounds ---
        background: { DEFAULT: '#FEFAF4', dark: '#1E1910' },
        foreground: { DEFAULT: '#251E14', dark: '#F4F0EB' },

        // --- Cards & Popovers ---
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#251E14',
          dark: '#261E14',
          'dark-foreground': '#F4F0EB',
        },

        // --- Primary: amarillo-naranja (CTAs) ---
        primary: {
          DEFAULT: '#EEC234',
          foreground: '#251E14',
        },

        // --- Secondary: crema suave ---
        secondary: {
          DEFAULT: '#F5F0E5',
          foreground: '#3D3428',
          dark: '#31271B',
          'dark-foreground': '#F4F0EB',
        },

        // --- Muted: gris cálido ---
        muted: {
          DEFAULT: '#F1EDE5',
          foreground: '#6A6052',
          dark: '#31271B',
          'dark-foreground': '#9E9891',
        },

        // --- Accent: coral/naranja ---
        accent: {
          DEFAULT: '#D06A35',
          foreground: '#FEFEFE',
        },

        // --- Estado: error ---
        destructive: {
          DEFAULT: '#C13D2A',
          foreground: '#FAFAFA',
          light: '#FCDDD9',
          dark: '#9E2B1F',
          'dark-foreground': '#F4F0EB',
          'dark-light': '#3D1B17',
        },

        // --- Estado: éxito ---
        success: {
          DEFAULT: '#25A05A',
          foreground: '#FAFAFA',
          light: '#D8F0E4',
          dark: '#1F8444',
          'dark-foreground': '#F4F0EB',
          'dark-light': '#1A3D28',
        },

        // --- Estado: advertencia ---
        warning: {
          DEFAULT: '#DFB030',
          foreground: '#251E14',
          light: '#FBF0C4',
          dark: '#C29420',
          'dark-foreground': '#251E14',
          'dark-light': '#3D3010',
        },

        // --- Bordes e inputs ---
        border: { DEFAULT: '#E6E1D8', dark: '#3D3428' },
        input:  { DEFAULT: '#ECE7DE', dark: '#3D3428' },
        ring:   { DEFAULT: '#EEC234' },
      },

      borderRadius: {
        sm:    '7px',
        md:    '10px',
        lg:    '12px',   // base (= --radius 0.75rem de la web)
        xl:    '17px',
        '2xl': '22px',
        '3xl': '26px',
        '4xl': '31px',
      },
    },
  },
  plugins: [],
};
