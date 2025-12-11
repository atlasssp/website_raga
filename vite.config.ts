import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      closeBundle() {
        try {
          copyFileSync('.htaccess', 'dist/.htaccess');
          console.log('✓ .htaccess copied to dist folder');
        } catch (error) {
          console.warn('⚠ Could not copy .htaccess:', error);
        }
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
