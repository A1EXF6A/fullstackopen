import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
        proxy: {
            // Configura proxy para las rutas API
            '/api': {
                target: 'http://localhost:3005', // Donde corre json-server
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    optimizeDeps: {
        exclude: ['json-server'] // Excluye json-server de la optimización
    }
})