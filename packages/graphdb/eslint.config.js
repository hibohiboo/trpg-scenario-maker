import customConfig from '@trpg-scenario-maker/eslint-config-custom/worker.js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...customConfig],
  },
  {
    files: ['src/example.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['src/**/*.d.ts'],
    rules: {
      'max-classes-per-file': 'off',
    },
  },
]);
