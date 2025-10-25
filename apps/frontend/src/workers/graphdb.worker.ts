import {
  initializeDatabase,
  executeQuery,
  closeDatabase,
} from '@trpg-scenario-maker/graphdb';
import { readFSVFile } from '@trpg-scenario-maker/graphdb/db';

// リクエスト/レスポンス型
export interface GraphDBWorkerRequest {
  type: string;
  payload?: unknown;
}

export interface GraphDBWorkerResponse {
  type: string;
  data?: unknown;
  success?: boolean;
  error?: string;
  originalType?: string;
}

// ハンドラー関数の型
type HandlerFunction = (
  payload: unknown,
) => Promise<Omit<GraphDBWorkerResponse, 'type'>>;

// ハンドラーマップ
const handlers = new Map<string, HandlerFunction>();

/**
 * データベース初期化ハンドラー
 */
handlers.set('init', async () => {
  await initializeDatabase();
  return { success: true, data: { message: 'Database initialized' } };
});

/**
 * クエリ実行ハンドラー
 */
handlers.set('execute', async (payload: unknown) => {
  const { query } = payload as { query: string };
  if (!query) {
    throw new Error('Query is required');
  }

  const data = await executeQuery(query);
  return { success: true, data };
});

/**
 * ローカルストレージへの永続化ハンドラー
 */
handlers.set('save', async (payload: unknown) => {
  const { query, filename } = payload as { query: string; filename: string };
  if (!query || !filename) {
    throw new Error('Query and filename are required');
  }

  await executeQuery(query);

  return { success: true, data: readFSVFile(filename) };
});

/**
 * データベースクローズハンドラー
 */
handlers.set('close', async () => {
  await closeDatabase();
  return { success: true, data: { message: 'Database closed' } };
});

// Workerメッセージハンドラー
const { self } = globalThis;
self.addEventListener(
  'message',
  async (event: MessageEvent<GraphDBWorkerRequest & { id: number }>) => {
    const { type, id, payload } = event.data;

    try {
      const handler = handlers.get(type);
      if (!handler) {
        throw new Error(`No handler registered for message type: ${type}`);
      }

      const result = await handler(payload);
      const response: GraphDBWorkerResponse = { type, ...result };

      self.postMessage({ id, ...response });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      self.postMessage({
        id,
        type: 'error',
        error: errorMessage,
        originalType: type,
      } satisfies GraphDBWorkerResponse & { id: number });
    }
  },
);
