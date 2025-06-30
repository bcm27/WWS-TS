import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get API URL from environment variable, fallback to localhost for local dev
const getApiTarget = () => {
  const apiUrl = process.env.VITE_API_URL;
  if (apiUrl) {
    return apiUrl;
  }
  
  // Check if we're in Docker (common environment variable pattern)
  if (process.env.DOCKER_ENV || process.env.NODE_ENV === 'docker') {
    return 'http://backend:3001';
  }
  
  // Default for local development
  return 'http://localhost:3001';
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: getApiTarget(),
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          console.log(`Proxying /api requests to: ${options.target}`);
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})