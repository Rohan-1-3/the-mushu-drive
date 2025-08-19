import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Set base path for GitHub Pages deployment
  const base = mode === 'github-pages' ? '/the-mushu-drive/' : '/'
  
  return {
    plugins: [react(), tailwindcss()],
    base: base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    }
  }
})
