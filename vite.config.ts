import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['ollama']
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react', 'ollama'],
  },
  server: {
    port: 5173,
  },
});
