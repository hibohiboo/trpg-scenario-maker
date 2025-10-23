import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

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
    tailwindcss(),
  ],

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
