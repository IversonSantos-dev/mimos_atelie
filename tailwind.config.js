/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Paleta oficial extraída do logotipo Mimos Ateliê
        atelie: {
          brown: {
            50: '#FAF6F3',
            100: '#F4EBE4',
            200: '#E8D6CB',
            300: '#D3B7A5',
            400: '#A7816A',
            500: '#7B553F',
            600: '#5D3B27',
            700: '#4A2C1B',
            800: '#382013', // Marrom escuro principal do traço e letras
            900: '#2A160C',
            950: '#1C0D07',
          },
          rose: {
            50: '#FDF8F6',
            100: '#FBF1EC',
            200: '#F5E0D7',
            300: '#ECCBC0', // Faixa do laço "ARTESANATOS"
            400: '#DFB2A3', // Monograma central BQ
            500: '#CE8E7D',
            600: '#B86D5B', // Terracota / rosé nobre
            700: '#995342',
            800: '#7A3F32',
            900: '#5E2E24',
          },
          cream: {
            50: '#FFFFFF',
            100: '#FCFAF8',
            200: '#FAF7F2', // Fundo linho / marfim do logotipo
            300: '#F4ECE3',
            400: '#EAE0D4',
            500: '#DCCEBD',
          },
        },
        // Compatibilidade semântica com classes existentes mapeadas para a nova paleta
        obsidian: {
          950: '#FAF7F2',
          900: '#2A160C',
          800: '#382013',
        },
        gold: {
          100: '#FDF8F6',
          200: '#F5E0D7',
          300: '#ECCBC0',
          400: '#DFB2A3',
          500: '#CE8E7D',
          600: '#B86D5B',
          700: '#995342',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 35px -5px rgba(223, 178, 163, 0.4)',
        'gold-glow-lg': '0 0 60px -10px rgba(184, 109, 91, 0.35)',
        'neon-white': '0 0 20px rgba(223, 178, 163, 0.45)',
        'atelie-soft': '0 10px 30px -10px rgba(56, 32, 19, 0.08)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #ECCBC0 0%, #DFB2A3 45%, #B86D5B 100%)',
        'blush-gradient': 'linear-gradient(135deg, #FDF8F6 0%, #ECCBC0 50%, #DFB2A3 100%)',
        'obsidian-radial': 'radial-gradient(circle at 50% 0%, rgba(223, 178, 163, 0.22) 0%, rgba(250, 247, 242, 0) 70%)',
      },
    },
  },
  plugins: [],
};

