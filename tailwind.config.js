export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          500: '#5b8cff',
          600: '#3c6ef2',
          900: '#122169',
        },
      },
      boxShadow: {
        panel: '0 26px 60px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
}
