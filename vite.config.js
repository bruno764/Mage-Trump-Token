import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  root: '.', // garante que o Vite use a raiz do projeto
  base: './', // adicionado para garantir que os caminhos relativos funcionem corretamente
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
    outDir: 'dist',  // Garante que a pasta 'dist' seja gerada
    rollupOptions: {
      input: './index.html' // força o uso do index.html raiz
    }
  },
  server: {
    // Ajuste o Vercel para rodar o local corretamente
    port: 5173,  // ou qualquer outra porta que você esteja utilizando localmente
  }
});
