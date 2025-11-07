import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import customConfig from './defaults.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
  baseDirectory: dirname,
});

export default defineConfig([
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['dist', 'public'],
    extends: [
      ...customConfig,
      ...compat.extends(
        'plugin:@conarti/eslint-plugin-feature-sliced/recommended',
      ),
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-alert': 'off',
      'no-console': 'off',
      // Redux Toolkit uses immer internally to allow "mutating" state
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['state'] },
      ],
      // Allow TO DO comments for future implementation
      'sonarjs/todo-tag': 'warn',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        myCustomGlobal: 'readonly',
      },
    },
  },
]);
