import {
  initializeDatabase,
  executeQuery,
  closeDatabase,
  readFSVFile,
  writeFSVFile,
  setItem,
  getItem,
} from '@trpg-scenario-maker/graphdb';
import { initSampleData } from '@trpg-scenario-maker/graphdb/db';
import { characterGraphHandlers } from '@/entities/character/workers/characterGraphHandlers';
import { characterRelationGraphHandlers } from '@/entities/character/workers/characterRelationGraphHandlers';
import { informationItemGraphHandlers } from '@/entities/informationItem/workers/informationItemGraphHandlers';
import { scenarioGraphHandlers } from '@/entities/scenario/workers/scenarioGraphHandlers';
import { scenarioCharacterGraphHandlers } from '@/entities/scenarioCharacter/workers/scenarioCharacterGraphHandlers';
import { scenarioCharacterRelationGraphHandlers } from '@/entities/scenarioCharacter/workers/scenarioCharacterRelationGraphHandlers';
import { sceneGraphHandlers } from '@/entities/scene/workers/sceneGraphHandlers';
import { sceneEventHandlers } from '@/entities/sceneEvent/workers/sceneEventHandlers';

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
 * サンプルデータ登録ハンドラー
 */
handlers.set('initSampleData', async () => {
  await initSampleData();
  return { success: true, data: { message: 'add sample data' } };
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
 * IndexedDBへの永続化ハンドラー
 */
handlers.set('save', async (payload: unknown) => {
  const { query, path } = payload as { query: string; path: string };
  if (!query || !path) {
    throw new Error('Query and path are required');
  }

  // クエリを実行してCSVファイルを生成
  await executeQuery(query);

  // ファイルシステムからデータを読み取り
  const content = readFSVFile(path);

  // IndexedDBに保存
  await setItem(path, content);

  return { success: true, data: { message: 'Data saved successfully' } };
});

handlers.set('load', async (payload: unknown) => {
  const { query, path } = payload as {
    query: string;
    path: string;
  };
  if (!query || !path) {
    throw new Error('Query and path are required');
  }

  // IndexedDBからデータを取得
  const content = await getItem(path);

  if (!content) {
    return { success: true, data: { message: 'Data loaded skip' } };
  }

  // ファイルシステムに書き込み
  await writeFSVFile(path, content);

  // クエリを実行してデータをロード
  await executeQuery(query);

  return { success: true, data: { message: 'Data loaded successfully' } };
});

/**
 * データベースクローズハンドラー
 */
handlers.set('close', async () => {
  await closeDatabase();
  return { success: true, data: { message: 'Database closed' } };
});

// シナリオグラフハンドラーを登録
scenarioGraphHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// シーングラフハンドラーを登録
sceneGraphHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// シーンイベントハンドラーを登録
sceneEventHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// キャラクターグラフハンドラーを登録
characterGraphHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// キャラクター関係性グラフハンドラーを登録
characterRelationGraphHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// シナリオ×キャラクターグラフハンドラーを登録
scenarioCharacterGraphHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// シナリオ×キャラクター関係性グラフハンドラーを登録
scenarioCharacterRelationGraphHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// 情報項目グラフハンドラーを登録
informationItemGraphHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
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
