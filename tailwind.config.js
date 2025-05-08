module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        userBubble: 'rgba(255,255,255,0.2)',
        noxBlue: '#00E3FF',
        white: '#ffffff'
      },
    },
  },
  plugins: [require('@tailwindcss/typography')]
}
/* Fix code block scroll behavior inside chat */
.prose pre {
  overflow-x: auto;
  white-space: pre;
  padding: 1rem;
  border-radius: 0.5rem;
}