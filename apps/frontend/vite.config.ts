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
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (moduleId) => {
          if (moduleId.includes('node_modules')) {
            return chunkRule(moduleId);
          }
          return null;
        },
      },
    },
    assetsInlineLimit: 0,
  },
});

function chunkRule(moduleId: string) {
  if (moduleId.includes('react-redux') || moduleId.includes('@reduxjs/toolkit'))
    return 'redux';
  if (moduleId.includes('react-router')) return 'router';
  if (moduleId.includes('react-icons')) return 'icons';
  if (moduleId.includes('@xyflow/react')) return 'reactflow';
  if (moduleId.includes('cytoscape')) return 'cytoscape';
  if (moduleId.includes('react-markdown') || moduleId.includes('remark-gfm'))
    return 'markdown';
  if (moduleId.includes('react')) return 'react';
  if (moduleId.includes('drizzle') || moduleId.includes('pglite')) return 'rdb';

  return 'vendor';
}
