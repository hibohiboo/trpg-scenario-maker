import customConfig from '@trpg-scenario-maker/eslint-config-custom/frontend.js';
import { defineConfig } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';

export default defineConfig(
  {
    extends: [
      ...customConfig,
      {
        files: ['**/**'],
        rules: {
          'no-underscore-dangle': ['off'],
          'no-restricted-exports': ['off'],
          'import/no-extraneous-dependencies': ['off'],
          'no-alert': ['off'],
          'no-console': ['off'],
          // UI packageではbarrel exportsが必要なため、FSD public-apiルールを無効化
          '@conarti/feature-sliced/public-api': ['off'],
        },
      },
      {
        files: ['src/**/*.stories.tsx'],
        rules: {
          'no-shadow': ['off'],
        },
      },
    ],
  },
  storybook.configs['flat/recommended'],
);
