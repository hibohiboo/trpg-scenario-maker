import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
  baseDirectory: dirname,
});
const eslintImport = [
  ...compat.config({
    extends: ['plugin:import/recommended', 'plugin:import/typescript'],
  }),
];

export default defineConfig([
  globalIgnores(['node_modules/', '.config/', 'dist/', 'tsconfig.json']),
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      sonarjs.configs.recommended,
      ...eslintImport,
    ],
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ], // importの並び順の設定
          pathGroupsExcludedImportTypes: ['builtin'],
          pathGroups: [
            { pattern: '@src/**', group: 'parent', position: 'before' },
          ], // エイリアスの位置を指定
          alphabetize: { order: 'asc' }, // グループ内のソート順
        },
      ],
      'import/prefer-default-export': ['off'],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^hono/.+'],
        },
      ],
      'import/extensions': ['off'],
    },
    // https://www.npmjs.com/package/eslint-plugin-import#user-content-typescript
    settings: {
      'import/resolver': {
        node: true,
        typescript: true,
      },
    },
  },
]);

// import js from '@eslint/js';
// import { defineConfig } from 'eslint/config';
// import prettierConfig from 'eslint-config-prettier';
// import importPlugin from 'eslint-plugin-import';
// import sonarjs from 'eslint-plugin-sonarjs';
// import unuserdPlugin from 'eslint-plugin-unused-imports';
// import tseslint from 'typescript-eslint';

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

// const compat = new FlatCompat({
//   baseDirectory: dirname,
// });

// export default defineConfig({
//   extends: [
//     js.configs.recommended,
//     ...tseslint.configs.recommended,
//     ...compat.extends('airbnb-base'),

//     prettierConfig,
//   ],
//   plugins: { import: importPlugin, 'unused-imports': unuserdPlugin, sonarjs },
//   rules: {
//     'linebreak-style': ['error', 'unix'],
//     semi: ['error', 'always'],
//     complexity: ['error', 7], // 複雑度の設定
//     // The typescript-eslint FAQ provides guidance here:
//     // https://typescript-eslint.io/troubleshooting/faqs/general/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
//     'no-undef': 'off',
//     // unuserd-importsのrecommended設定を適用
//     'no-unused-vars': 'off',
//     '@typescript-eslint/no-unused-vars': 'off',
//     'unused-imports/no-unused-imports': 'warn',
//     'unused-imports/no-unused-vars': [
//       'warn',
//       {
//         vars: 'all',
//         varsIgnorePattern: '^_',
//         args: 'after-used',
//         argsIgnorePattern: '^_',
//       },
//     ],
//     // ここまで unuserd-importsのrecommended設定を適用
//     'import/order': [
//       'warn',
//       {
//         groups: [
//           'builtin',
//           'external',
//           'internal',
//           'parent',
//           'sibling',
//           'index',
//           'object',
//           'type',
//         ], // importの並び順の設定
//         pathGroupsExcludedImportTypes: ['builtin'],
//         pathGroups: [
//           { pattern: '@src/**', group: 'parent', position: 'before' },
//         ], // エイリアスの位置を指定
//         alphabetize: { order: 'asc' }, // グループ内のソート順
//       },
//     ],
//     'import/prefer-default-export': ['off'],
//     'import/no-unresolved': [
//       'error',
//       {
//         ignore: ['^hono/.+'],
//       },
//     ],
//     'import/extensions': ['off'],
//   },
//   settings: {
//     'import/resolver': {
//       node: {
//         extensions: ['.js', '.jsx', '.ts', '.tsx'],
//       },
//       typescript: {},
//     },
//   },
// });
