import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/Car-Model/",  // <--- THIS IS THE FIX. It matches your repository name.
  define: {
    'process.env': process.env
  }
});
