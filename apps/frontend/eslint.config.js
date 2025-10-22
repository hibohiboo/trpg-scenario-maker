import customConfig from '@trpg-scenario-maker/eslint-config-custom/frontend.js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...customConfig],
  },
]);
