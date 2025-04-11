import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';

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
  resolve: {
    alias: {
      buffer: 'buffer',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer']
        }),
        rollupNodePolyFill()
      ]
    }
  }
});
