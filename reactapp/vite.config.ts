import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://n8n.srv1048389.hstgr.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/webhook'),
        secure: false,
      }
    }
  }
})
