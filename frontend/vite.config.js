import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Обновленная конфигурация
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3211',
        changeOrigin: true
      }
    }
  }
});