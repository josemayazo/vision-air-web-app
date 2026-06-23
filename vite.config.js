import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://vision-air-rii8h.sevalla.app',
        changeOrigin: true,
      },
    },
  },
})
