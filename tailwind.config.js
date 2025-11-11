export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D051F',
        neonMagenta: '#B026FF',
        neonCyan: '#00F5FF',
        softAmber: '#FFD26A',
      },
      borderRadius: {
        '4xl': '2rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,.25)',
        neon: '0 0 20px rgba(176,38,255,.4)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(1200px 600px at 20% 10%, rgba(176,38,255,.18), transparent 60%), radial-gradient(1000px 600px at 80% 20%, rgba(0,245,255,.12), transparent 60%), linear-gradient(180deg, #100624 0%, #0D051F 100%)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floaty: { '0%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' }, '100%': { transform: 'translateY(0)' } }
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        floaty: 'floaty 4s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
