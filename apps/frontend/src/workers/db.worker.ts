import { runMigrate } from '@trpg-scenario-maker/rdb/db/runMigrate';
import { scenarioHandlers } from '@/entities/scenario/workers/scenarioHandlers';

// 汎用リクエスト/レスポンス型
export interface DBWorkerRequest {
  type: string;
  payload?: unknown;
}

export interface DBWorkerResponse {
  type: string;
  data?: unknown;
  success?: boolean;
  error?: string;
  originalType?: string;
}

// ハンドラー関数の型
type HandlerFunction = (
  payload: unknown,
) => Promise<Omit<DBWorkerResponse, 'type'>>;

// ハンドラーマップ
const handlers = new Map<string, HandlerFunction>();

// マイグレーションハンドラー（共通）
handlers.set('migrate', async () => {
  await runMigrate();
  return { success: true };
});

// シナリオハンドラーを登録
scenarioHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// Workerメッセージハンドラー
const { self } = globalThis;
self.addEventListener(
  'message',
  async (event: MessageEvent<DBWorkerRequest & { id: number }>) => {
    const { type, id, payload } = event.data;

    try {
      const handler = handlers.get(type);
      if (!handler) {
        throw new Error(`No handler registered for message type: ${type}`);
      }

      const result = await handler(payload);
      const response: DBWorkerResponse = { type, ...result };

      self.postMessage({ id, ...response });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      self.postMessage({
        id,
        type: 'error',
        error: errorMessage,
        originalType: type,
      } satisfies DBWorkerResponse & { id: number });
    }
  },
);
function getScenarioCountQuery() {
  throw new Error('Function not implemented.');
}
