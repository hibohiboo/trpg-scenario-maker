import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const basePath = 'trpg-scenario-maker';

// https://vite.dev/config/
export default defineConfig({
  base: `/${basePath}/`,
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@trpg-scenario-maker/ui/tailwind.css': resolve(
        __dirname,
        '../../packages/ui/src/styles/tailwind.css',
      ),
    },
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
  },
});
