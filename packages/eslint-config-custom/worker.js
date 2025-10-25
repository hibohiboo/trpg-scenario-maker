import globals from 'globals';
import customConfig from './defaults.js';

export default [
  ...customConfig,
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'node_modules/**', 'drizzle/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
