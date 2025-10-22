import customConfig from '@trpg-scenario-maker/eslint-config-custom/frontend.js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...customConfig],
  },
]);
