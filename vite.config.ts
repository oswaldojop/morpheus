import { defineConfig } from 'vite';
export default defineConfig({
  base: './', // Crucial para GitHub Pages em subpastas
  build: { outDir: 'dist' }
});