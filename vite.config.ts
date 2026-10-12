import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion'
          if (id.includes('lucide-react')) return 'icons'
          if (
            id.includes('react-router') ||
            id.includes('@tanstack') ||
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('scheduler')
          )
            return 'vendor'
        },
      },
    },
  },
})
