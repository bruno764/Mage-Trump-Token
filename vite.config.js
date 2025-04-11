import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  base: '', // importante para build no Vercel
  plugins: [
    react(),
    {
      ...NodeGlobalsPolyfillPlugin({
        buffer: true
      }),
      enforce: 'post'
    }
  ],
  define: {
    global: 'globalThis'
  },
  build: {
    outDir: 'dist'
  }
});
