# Frontend Application

TRPGシナリオメーカーのフロントエンドアプリケーション

## 技術スタック

- **React** 19.2.0 + TypeScript
- **Vite (Rolldown)** - 高速ビルドツール
- **Redux Toolkit** - 状態管理
- **PGlite** - ブラウザ内PostgreSQL (IndexedDB backend)
- **Drizzle ORM** - 型安全なORM
- **Web Worker** - バックグラウンドスレッドでのDB操作
- **Tailwind CSS** 4.1.15 - スタイリング

## アーキテクチャ

### Web Worker + IndexedDBアーキテクチャ

このアプリケーションは、UIスレッドをブロックせずに高速なデータベース操作を実現するため、Web Workerを使用したマルチスレッドアーキテクチャを採用しています。

```
┌─────────────────────────────────────────────────────────────┐
│  Main Thread                                                │
│  ┌─────────────┐       ┌─────────────────┐                  │
│  │ React UI    │◄─────►│ Redux Store     │                  │
│  └─────────────┘       └────────┬────────┘                  │
│                                 │                           │
│                        ┌────────▼────────┐                  │
│                        │ scenarioApi     │                  │
│                        └────────┬────────┘                  │
│                                 │                           │
│                        ┌────────▼────────┐                  │
│                        │ dbWorkerClient  │                  │
│                        └────────┬────────┘                  │
└─────────────────────────────────┼───────────────────────────┘
                                  │ postMessage({ type, payload })
                         ┌────────▼────────┐
                         │  Web Worker     │
                         │  (db.worker.ts) │
                         │  ┌──────────┐   │
                         │  │ Handlers │   │
                         │  └────┬─────┘   │
                         └───────┼─────────┘
                                 │
                         ┌───────▼─────────┐
                         │  PGlite Client  │
                         │  + Drizzle ORM  │
                         └───────┬─────────┘
                                 │
                         ┌───────▼─────────┐
                         │  IndexedDB      │
                         │  (idb://)       │
                         └─────────────────┘
```

### ディレクトリ構成

```
src/
├── workers/                    # Web Worker実装
│   ├── db.worker.ts           # Workerメインファイル（ハンドラー登録）
│   ├── dbWorkerClient.ts      # Workerクライアント（singleton）
│   ├── BaseWorkerClient.ts    # 汎用Workerクライアント基底クラス
│   └── types.ts               # Worker型定義
│
├── entities/                   # エンティティ層（DDD風）
│   └── scenario/
│       ├── workers/
│       │   └── scenarioHandlers.ts  # シナリオエンティティのハンドラー定義
│       ├── api/
│       │   └── scenarioApi.ts       # API層（Worker呼び出し）
│       └── store/
│           ├── scenarioSlice.ts     # Redux Slice
│           └── scenarioActions.ts   # Async Thunks
│
└── main.tsx                    # エントリポイント（Worker初期化）
```

## Web Workerアーキテクチャ詳細

### 1. Worker初期化フロー

アプリケーション起動時に自動的にWorkerを初期化し、データベースマイグレーションを実行します。

**[main.tsx](src/main.tsx)**

```typescript
import { dbWorkerClient } from './workers/dbWorkerClient';

// DBWorkerを初期化（マイグレーション自動実行）
await dbWorkerClient.initialize();

// 初期化完了後にReactアプリをレンダリング
createRoot(document.getElementById('root')!).render(<App />);
```

### 2. BaseWorkerClient - 汎用Worker基底クラス

**[BaseWorkerClient.ts](src/workers/BaseWorkerClient.ts)**

すべてのWorkerクライアントの基底クラスで、以下の機能を提供します：

- **リクエスト/レスポンス管理**: メッセージIDによる非同期通信の管理
- **エラーハンドリング**: Worker内エラーの自動検出・伝播
- **ライフサイクル管理**: Worker生成・初期化・終了処理
- **型安全性**: ジェネリクスによる型推論

```typescript
export abstract class BaseWorkerClient<TInitResponse = unknown> {
  protected worker: Worker | null = null;
  private pendingRequests = new Map<number, PendingRequest<unknown>>();

  async initialize(): Promise<TInitResponse> {
    this.worker = new Worker(this.getWorkerUrl(), { type: 'module' });
    this.worker.addEventListener('message', this.handleMessage);
    return this.onInitialize();
  }

  protected async sendRequest<T>(type: string, payload?: unknown): Promise<T> {
    const id = this.generateRequestId();
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker!.postMessage({ id, type, payload });
    });
  }

  abstract getWorkerUrl(): URL;
  abstract onInitialize(): Promise<TInitResponse>;
}
```

### 3. dbWorkerClient - データベースWorkerクライアント

**[dbWorkerClient.ts](src/workers/dbWorkerClient.ts)**

`BaseWorkerClient`を継承し、データベース操作専用のクライアントを提供します。

```typescript
class DBWorkerClient extends BaseWorkerClient<void> {
  getWorkerUrl(): URL {
    return new URL('./db.worker.ts', import.meta.url);
  }

  async onInitialize(): Promise<void> {
    // マイグレーション実行
    await this.sendRequest('migrate');
  }

  async request<T>(type: string, payload?: unknown): Promise<T> {
    return this.sendRequest<T>(type, payload);
  }
}

// Singleton export
export const dbWorkerClient = new DBWorkerClient();
```

### 4. db.worker.ts - Workerメインファイル

**[db.worker.ts](src/workers/db.worker.ts)**

Worker内で実行されるメインファイル。ハンドラーを登録し、メッセージをディスパッチします。

```typescript
import { runMigrate } from '@trpg-scenario-maker/rdb/db/runMigrate';
import { scenarioHandlers } from '@/entities/scenario/workers/scenarioHandlers';

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
self.addEventListener('message', async (event) => {
  const { type, id, payload } = event.data;

  try {
    const handler = handlers.get(type);
    if (!handler) {
      throw new Error(`No handler registered for message type: ${type}`);
    }

    const result = await handler(payload);
    self.postMessage({ id, type, ...result });
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error.message,
      originalType: type,
    });
  }
});
```

### 5. ハンドラー定義パターン

**[scenarioHandlers.ts](src/entities/scenario/workers/scenarioHandlers.ts)**

各エンティティのハンドラーを配列で定義します。循環依存を避けるための設計です。

```typescript
import {
  selectScenarios,
  insertScenario,
  updateScenario,
  deleteScenario,
  countScenarios,
} from '@trpg-scenario-maker/rdb/queries/scenario';

export const scenarioHandlers = [
  {
    type: 'scenario:getList',
    handler: async () => {
      const data = await selectScenarios();
      return { data };
    },
  },
  {
    type: 'scenario:create',
    handler: async (payload: unknown) => {
      const params = payload as { title: string; description?: string };
      const data = await insertScenario(params);
      return { data };
    },
  },
  {
    type: 'scenario:update',
    handler: async (payload: unknown) => {
      const { id, ...params } = payload as { id: number; title?: string };
      const data = await updateScenario(id, params);
      return { data };
    },
  },
  {
    type: 'scenario:delete',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: number };
      await deleteScenario(id);
      return { success: true };
    },
  },
  {
    type: 'scenario:getCount',
    handler: async () => {
      const data = await countScenarios();
      return { data };
    },
  },
];
```

### 6. API層 - 型安全なインターフェース

**[scenarioApi.ts](src/entities/scenario/api/scenarioApi.ts)**

Workerクライアントを呼び出す型安全なAPI層を提供します。

```typescript
import { dbWorkerClient } from '@/workers/dbWorkerClient';
import type { Scenario } from '@trpg-scenario-maker/rdb/schema';

export const scenarioApi = {
  getList: () => dbWorkerClient.request<Scenario[]>('scenario:getList'),

  create: (params: { title: string; description?: string }) =>
    dbWorkerClient.request<Scenario>('scenario:create', params),

  update: (id: number, params: { title?: string; description?: string }) =>
    dbWorkerClient.request<Scenario>('scenario:update', { id, ...params }),

  delete: (id: number) =>
    dbWorkerClient.request<void>('scenario:delete', { id }),

  getCount: () => dbWorkerClient.request<number>('scenario:getCount'),
};
```

### 7. Redux統合

**[scenarioActions.ts](src/entities/scenario/store/scenarioActions.ts)**

Redux Thunkから`scenarioApi`を呼び出します。

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { scenarioApi } from '../api/scenarioApi';

export const fetchScenarios = createAsyncThunk(
  'scenario/fetchAll',
  async () => {
    return await scenarioApi.getList();
  },
);

export const createScenario = createAsyncThunk(
  'scenario/create',
  async (params: { title: string; description?: string }) => {
    return await scenarioApi.create(params);
  },
);
```

### データフロー完全図

```
┌──────────────────┐
│ React Component  │
│ useDispatch()    │
└────────┬─────────┘
         │ dispatch(fetchScenarios())
         ▼
┌────────────────────┐
│ Redux Thunk        │
│ scenarioActions.ts │
└────────┬───────────┘
         │ scenarioApi.getList()
         ▼
┌────────────────────┐
│ scenarioApi.ts     │
└────────┬───────────┘
         │ dbWorkerClient.request('scenario:getList')
         ▼
┌────────────────────┐
│ dbWorkerClient.ts  │
│ sendRequest()      │
└────────┬───────────┘
         │ postMessage({ id, type: 'scenario:getList' })
         ▼
┌─────────────────────────────────────────┐
│ Web Worker Thread                       │
│ ┌─────────────────────────────────────┐ │
│ │ db.worker.ts                        │ │
│ │ handlers.get('scenario:getList')()  │ │
│ └─────────────┬───────────────────────┘ │
│               ▼                         │
│ ┌─────────────────────────────────────┐ │
│ │ scenarioHandlers.ts                 │ │
│ │ selectScenarios()                   │ │
│ └─────────────┬───────────────────────┘ │
│               ▼                         │
│ ┌─────────────────────────────────────┐ │
│ │ PGlite + Drizzle ORM                │ │
│ │ SELECT * FROM scenarios             │ │
│ └─────────────┬───────────────────────┘ │
└───────────────┼─────────────────────────┘
                ▼
┌───────────────────────┐
│ IndexedDB (idb://)    │
│ Browser Storage       │
└───────────────────────┘
```

## 新しいエンティティの追加方法

1. **ハンドラー定義を作成**: `src/entities/{entity}/workers/{entity}Handlers.ts`
2. **Workerに登録**: `db.worker.ts`で`handlers.set()`を追加
3. **API層を作成**: `src/entities/{entity}/api/{entity}Api.ts`
4. **Redux統合**: Slice・Thunksを作成

**例: Characterエンティティの追加**

```typescript
// 1. src/entities/character/workers/characterHandlers.ts
export const characterHandlers = [
  {
    type: 'character:getList',
    handler: async () => {
      const data = await selectCharacters();
      return { data };
    },
  },
];

// 2. src/workers/db.worker.ts
import { characterHandlers } from '@/entities/character/workers/characterHandlers';
characterHandlers.forEach(({ type, handler }) => {
  handlers.set(type, handler);
});

// 3. src/entities/character/api/characterApi.ts
export const characterApi = {
  getList: () => dbWorkerClient.request<Character[]>('character:getList'),
};

// 4. Redux統合（省略）
```

## ビルド設定

**[vite.config.ts](vite.config.ts)**

Workerを正しくバンドルするための設定：

```typescript
export default defineConfig({
  worker: {
    format: 'es', // ES Modules形式
    plugins: () => [], // Workerビルド時のプラグイン無効化
  },
});
```

## パフォーマンス上の利点

1. **UIスレッド非ブロック**: DB操作がWorkerで実行されるため、UIが固まらない
2. **並列処理**: 複数のDB操作を並行実行可能
3. **型安全性**: TypeScriptによる完全な型チェック
4. **スケーラブル**: 新しいエンティティを簡単に追加可能

## 開発

### 開発サーバー起動

```bash
bun run dev
```

### ビルド

```bash
bun run build
```

### リント・型チェック

```bash
bun run lint
bun run typecheck
```

## ライセンス

MIT
