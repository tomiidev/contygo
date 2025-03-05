import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist"
  },
  resolve: {
    alias: {
      '@': '/src',  // Aquí indicamos que "@" debe apuntar a la carpeta "src"
    },
  },
})
