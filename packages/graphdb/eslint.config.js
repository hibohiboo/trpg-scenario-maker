import customConfig from '@trpg-scenario-maker/eslint-config-custom/worker.js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts', 'vitest.config.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...customConfig],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.test.ts'],
    extends: [...customConfig],
    rules: {
      'no-console': 'off',
      'import/no-extraneous-dependencies': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
    },
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
