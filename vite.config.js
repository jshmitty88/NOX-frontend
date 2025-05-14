import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true
  },
  preview: {
    port: process.env.PORT,
    host: true,
    strictPort: true,
    allowedHosts: ['noxops.io', 'healthcheck.railway.app']
  }
})