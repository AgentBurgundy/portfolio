import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        ws: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.log('Proxy error:', err)
            if (res && !res.headersSent) {
              res.writeHead(502, {
                'Content-Type': 'application/json',
              })
              res.end(JSON.stringify({
                success: false,
                message: 'Backend server is not running. Please start it with: npm run start',
              }))
            }
          })
        },
      },
    },
  },
})
