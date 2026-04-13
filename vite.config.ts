import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      // This tells Vite: "If a request starts with /api, send it to the backend"
      '/api': {
        target: 'http://localhost:9005', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
})