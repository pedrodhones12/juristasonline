import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use relative asset URLs so the build works both at
  // /juristasonline/ and when GitHub Pages serves it from /.
  base: './',
});
