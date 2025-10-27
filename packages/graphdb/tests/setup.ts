import { vi } from 'vitest';
import {
  initializeWebDatabase,
  initializeWebConnection,
} from './mock/helper.mjs';

export const setupKuzuMock = () => {
  vi.mock('@kuzu/kuzu-wasm', async () => {
    const { default: originalModule } = (await vi.importActual(
      '@kuzu/kuzu-wasm',
    )) as any;
    return {
      default: async () => {
        const m = await originalModule();
        const Database = () => initializeWebDatabase(m);
        const Connection = (...args: [any, number]) =>
          initializeWebConnection(m, ...args);
        return {
          ...m,
          Database,
          Connection,
        };
      },
    };
  });
};
