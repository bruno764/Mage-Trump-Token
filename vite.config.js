import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  root: '.', // garante que o Vite use a raiz do projeto
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
    outDir: 'dist',
    rollupOptions: {
      input: './index.html' // força o uso do index.html raiz
    }
  }
});
