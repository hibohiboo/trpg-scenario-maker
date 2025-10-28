import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // グロブパターンでpackages配下の全プロジェクトを指定
    projects: ['packages/*'],

    // ルートレベルの設定（全プロジェクト共通）
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      reportsDirectory: './coverage',
      include: ['packages/**/src/**/*.ts', 'packages/**/src/**/*.tsx'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.stories.tsx',
        '**/types/**',
      ],
    },
    reporters: ['default', 'html', 'json'],
    outputFile: {
      html: './test-results/index.html',
      json: './test-results/results.json',
    },
  },
});
