import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/Car-Model/",   // <--- THIS WAS MISSING IN YOUR SCREENSHOT
  define: {
    'process.env': process.env
  }
});
