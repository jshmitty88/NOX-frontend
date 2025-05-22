module.exports = {
  content: [
    './index.html',
    './public/index.html',          // ✅ put this here
    './src/**/*.{js,ts,jsx,tsx}'
  ],

  safelist: [
    'text-[15px]',
    'leading-[1.4]',
    'leading-[1.5]',
    'space-y-[0.2rem]',
    'mb-[0.4rem]',
    'list-inside',
    'pl-4'
  ],

  theme: {
    extend: {
      colors: {
        background: '#000000',
        userBubble: 'rgba(255,255,255,0.2)',
        noxBlue: '#00E3FF',
        white: '#ffffff'
      }
    }
  },

  plugins: [require('@tailwindcss/typography')]
}