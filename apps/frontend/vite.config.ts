import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const basePath = 'trpg-scenario-maker';

// https://vite.dev/config/
export default defineConfig({
  base: `/${basePath}/`,
  define: {
    BASE_PATH: `${JSON.stringify(basePath)}`,
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['@electric-sql/pglite', '@kuzu/kuzu-wasm'],
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
    },
  },
  worker: {
    format: 'es',
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (moduleId) => {
          if (moduleId.includes('node_modules')) {
            return moduleId.includes('react') ? 'react' : 'vendor';
          }
          return null;
        },
      },
    },
    assetsInlineLimit: 0,
  },
});
