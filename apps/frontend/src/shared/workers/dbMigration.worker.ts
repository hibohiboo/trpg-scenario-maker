import { runMigrate } from '@trpg-scenario-maker/rdb/db/runMigrate';

// DB初期化Workerのリクエスト型
export type DBMigrationWorkerRequest = { type: 'migrate' };

// DB初期化Workerのレスポンス型
export type DBMigrationWorkerResponse =
  | { type: 'migrate'; success: true }
  | { type: 'error'; error: string; originalType: string };

// Workerメッセージハンドラー
const { self } = globalThis;
self.addEventListener(
  'message',
  async (event: MessageEvent<DBMigrationWorkerRequest & { id: number }>) => {
    const { type, id } = event.data;

    try {
      let response: DBMigrationWorkerResponse;

      switch (type) {
        case 'migrate': {
          await runMigrate();
          response = { type: 'migrate', success: true };
          break;
        }

        default:
          throw new Error(`Unknown message type: ${type}`);
      }

      self.postMessage({ id, ...response });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      self.postMessage({
        id,
        type: 'error',
        error: errorMessage,
        originalType: type,
      } satisfies DBMigrationWorkerResponse & { id: number });
    }
  },
);
