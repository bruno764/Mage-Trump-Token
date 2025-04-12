import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  base: '',
  plugins: [
    react(),
    {
      ...NodeGlobalsPolyfillPlugin({
        buffer: true,
        process: true
      }),
      enforce: 'post'
    }
  ],
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process'
    }
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true
        })
      ]
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
        inject({
          Buffer: ['buffer', 'Buffer']
        })
      ]
    }
  }
});
