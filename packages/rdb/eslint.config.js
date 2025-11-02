import customConfig from '@trpg-scenario-maker/eslint-config-custom/worker.js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'vitest.config.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...customConfig],
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    extends: [...customConfig],
    rules: {
      'no-console': 'off',
      'import/no-extraneous-dependencies': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      'no-restricted-syntax': ['off'],
      'no-await-in-loop': ['off'],
      'no-plusplus': ['off'],
    },
  },
]);
