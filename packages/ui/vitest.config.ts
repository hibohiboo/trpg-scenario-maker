import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    projects: [
      {
        plugins: [
          // https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            tags: {
              include: ['test'],
              exclude: ['experimental'],
            },
          }),
        ],
        test: {
          name: 'storybook',
          // Enable browser mode
          browser: {
            enabled: true,
            // Make sure to install Playwright
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
      {
        test: {
          include: ['**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          globals: true,
        },
      },
    ],
  },
});
