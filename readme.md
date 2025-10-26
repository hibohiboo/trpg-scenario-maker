# TRPG Scenario Maker

TRPGシナリオを可視化しながら作成できるWebアプリケーション

[Demo Page](https://hibohiboo.github.io/trpg-scenario-maker/)

[Github](https://github.com/hibohiboo/trpg-scenario-maker)

## 概要

TRPG Scenario Makerは、TRPGのシナリオ作成を支援するフロントエンドアプリケーションです。シナリオの構造を視覚的に整理し、キャラクター・場所・イベントなどの要素を関連付けながら、効率的にシナリオを組み立てることができます。

### 特徴

- **ビジュアルエディタ**: シナリオの流れをフローチャートやマインドマップのように可視化
- **要素管理**: キャラクター、場所、アイテム、イベントなどを一元管理
- **オフライン動作**: バックエンド不要、ブラウザのみで完結
- **データ保存**: IndexedDB（PGlite）による本格的なリレーショナルDB
- **高パフォーマンス**: Web WorkerによるマルチスレッドDB操作
- **GitHub Pages対応**: 無料で公開・共有可能

## 技術スタック

### コア

- **React**: 19.2.0
- **TypeScript**: 型安全性
- **Vite (Rolldown)**: 高速ビルドツール

### データベース・ストレージ

- **PGlite**: ブラウザ内PostgreSQL（IndexedDB backend）
- **Drizzle ORM**: 型安全なORMライブラリ
- **Kuzu-Wasm**: ブラウザ内グラフデータベース（LocalStorage backend）
- **Web Worker**: バックグラウンドスレッドでのDB操作
- **IndexedDB**: ブラウザローカルストレージ（RDB用）
- **LocalStorage**: ブラウザストレージ（GraphDB用）

### 開発環境

- **Bun**: 1.3.1+ (パッケージマネージャー)
- **Turbo**: 2.5.8 (モノレポ管理)
- **Vitest**: 4.0.1 (テストフレームワーク)

### コード品質

- **ESLint**: 9.38.0 (リンター)
- **Prettier**: 3.6.2 (フォーマッター)
- **TypeScript ESLint**: 型チェック対応

### UIコンポーネント開発

- **Storybook**: 9.1.13 (コンポーネントカタログ)
- **Tailwind CSS**: 4.1.15 (スタイリング)
- **React Icons**: 5.5.0 (アイコンライブラリ)

### デプロイ

- **GitHub Pages**: 自動デプロイ (GitHub Actions)

## プロジェクト構成

```
trpg-scenario-maker/
├── apps/
│   └── frontend/              # Reactフロントエンドアプリケーション
│       ├── src/
│       │   ├── workers/       # Web Worker実装（DB操作）
│       │   ├── entities/      # エンティティ層（ドメインロジック）
│       │   └── ...
│       ├── public/            # 静的ファイル
│       ├── dist/              # ビルド出力（GitHub Pages公開用）
│       ├── vite.config.ts     # Vite設定
│       └── package.json
├── packages/
│   ├── rdb/                   # データベース層（PGlite + Drizzle）
│   │   ├── src/db/            # DB接続・マイグレーション
│   │   └── src/queries/       # リポジトリパターンのクエリ層
│   │       └── scenarioRepository.ts  # シナリオCRUD操作
│   ├── graphdb/               # グラフデータベース層（Kuzu-Wasm）
│   │   ├── src/schemas.ts     # グラフスキーマ定義
│   │   └── src/queries/       # リポジトリパターンのクエリ層
│   │       └── scenarioRepository.ts  # シナリオグラフ操作
│   ├── ui/                    # UIコンポーネントライブラリ（Storybook対応）
│   ├── eslint-config-custom/  # 共通ESLint設定
│   └── tsconfig/              # 共通TypeScript設定
├── .github/
│   └── workflows/
│       └── gh-pages.yml       # GitHub Pages自動デプロイ設定
├── package.json               # ルートパッケージ設定（workspace管理）
├── turbo.json                 # Turboビルド設定
└── readme.md                  # このファイル
```

## セットアップ

### 前提条件

- [Bun](https://bun.sh/) 1.3.1以上

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/hibohiboo/trpg-scenario-maker.git
cd trpg-scenario-maker

# 依存関係のインストール
bun install
```

## 開発

### 開発サーバーの起動

```bash
bun run dev
```

### Storybookの起動

UIコンポーネントをStorybookで確認・開発できます:

```bash
cd packages/ui
bun run dev
```

http://localhost:6006 でStorybookが起動します。

### ビルド

```bash
bun run build
```

### リント

```bash
bun run lint
```

### テスト実行

```bash
bun run test
```

### 依存関係の更新

```bash
bun run ncu
```

## デプロイ

このプロジェクトはGitHub Pagesで自動公開されます。

### 自動デプロイの仕組み

1. `main`ブランチにプッシュすると、GitHub Actions（`.github/workflows/gh-pages.yml`）が自動実行
2. `bun install` → `bun run build` で `apps/frontend/dist` にビルド
3. ビルド成果物を自動的にGitHub Pagesへデプロイ
4. https://hibohiboo.github.io/trpg-scenario-maker/ で公開

### 手動デプロイ

GitHub Actionsのワークフローページから手動実行も可能です。

## ライセンス

MIT

## 貢献

Issue報告やPull Requestを歓迎します。

## アーキテクチャ

### Web Worker + IndexedDBアーキテクチャ

このアプリケーションは、メインスレッドをブロックせずに高速なデータベース操作を実現するため、Web Workerアーキテクチャを採用しています。

```
┌─────────────────────────────────────────────┐
│  Frontend (Main Thread)                     │
│  ┌─────────────┐       ┌─────────────────┐  │
│  │ React UI    │◄─────►│ Redux Store     │  │
│  └─────────────┘       └────────┬────────┘  │
│                                 │           │
│                        ┌────────▼────────┐  │
│                        │ dbWorkerClient  │  │
│                        └────────┬────────┘  │
└─────────────────────────────────┼───────────┘
                                  │ postMessage
                         ┌────────▼────────┐
                         │  Web Worker     │
                         │  (db.worker.ts) │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │  PGlite         │
                         │  (PostgreSQL)   │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │  IndexedDB      │
                         └─────────────────┘
```

**主要コンポーネント:**

- **[db.worker.ts](apps/frontend/src/workers/db.worker.ts)**: Web Workerメインファイル（ハンドラー登録・メッセージ処理）
- **[dbWorkerClient.ts](apps/frontend/src/workers/dbWorkerClient.ts)**: Workerクライアント（メインスレッド側のインターフェース）
- **[BaseWorkerClient.ts](apps/frontend/src/workers/BaseWorkerClient.ts)**: 汎用Workerクライアント基底クラス
- **[scenarioHandlers.ts](apps/frontend/src/entities/scenario/workers/scenarioHandlers.ts)**: シナリオエンティティのハンドラー定義

**データフロー例:**

```typescript
// 1. Reactコンポーネントからディスパッチ
dispatch(fetchScenarios());

// 2. Redux Thunkが scenarioApi を呼び出し
const scenarios = await scenarioApi.getList();

// 3. dbWorkerClient がWorkerにリクエスト送信
dbWorkerClient.request('scenario:getList');

// 4. Worker内でハンドラー実行（PGlite経由でIndexedDB操作）
const result = await selectScenarios();

// 5. レスポンスがメインスレッドに返却され、Storeが更新される
```

詳細は [apps/frontend/README.md](apps/frontend/README.md) を参照してください。

### GraphDB（グラフデータベース）アーキテクチャ

シナリオの構造（シーン間の関連性）を効率的に管理するため、RDB（PGlite）に加えてグラフデータベース（Kuzu-Wasm）を併用しています。

#### データ管理の役割分担

- **RDB（PGlite + IndexedDB）**: シナリオ・キャラクター・アイテムなどのマスターデータ
- **GraphDB（Kuzu-Wasm + LocalStorage）**: シーンの繋がり・関連性（グラフ構造）

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Frontend (Main Thread)                                                      │
│  ┌─────────────┐       ┌──────────────────────┐                              │
│  │ React UI    │◄─────►│ Scene Graph          │                              │
│  └─────────────┘       └──────────┬───────────┘                              │
│                                   │                                          │
│                      ┌────────────▼───────────┐       ┌────────────────────┐ │
│                      │ graphdbWorkerClient    │◄─────►│  LocalStorage      │ │
│                      └────┬───────────────────┘       │  (CSV形式保存/復元) │ │
│                           │                           └────────────────────┘ │
│                           │                                                  │
└───────────────────────────┼──────────────────────────────────────────────────┘
                            │ postMessage
                   ┌────────▼────────┐
                   │  Web Worker     │
                   │(graphdb.worker) │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐       ┌────────────────────────────┐
                   │  Kuzu-Wasm      │◄─────►│  VFS (Virtual File System) │
                   │  (Graph Query)  │       │  (CSV形式保存/復元)         │
                   └─────────────────┘       └────────────────────────────┘
```

**主要コンポーネント:**

**グラフデータベースのスキーマ [packages/graphdb/src/schemas.ts](packages/graphdb/src/schemas.ts)**
**LocalStorageへの保存 ([graphdbWorkerClient.ts:58-63](apps/frontend/src/workers/graphdbWorkerClient.ts#L58-L63)):**
**シーン取得の例 ([sceneApi.ts:11-25](frontend/src/entities/scene/api/sceneApi.ts#L11-L25)):**
**シーン作成の例 ([sceneApi.ts:61-71](sceneApi.ts#L61-L71)):**
**シーン間接続の取得 ([sceneApi.ts:30-48](apps/frontend/src/entities/scene/api/sceneApi.ts#L30-L48)):**
**シーングラフの取得と更新 ([useScenarioDetailPage.ts:10-12](apps/frontend/src/page/scenarioDetail/hooks/useScenarioDetailPage.ts#L10-L12)):**

詳細な実装（スキーマ、クエリ例、API使用例）は [apps/frontend/README.md](apps/frontend/README.md) を参照してください。

## ロードマップ

- [x] GitHub Pages公開設定
- [x] Web Worker + IndexedDBアーキテクチャ実装
- [x] PGlite + Drizzle ORM統合
- [x] Kuzu-Wasm + GraphDB統合
- [x] シナリオ一覧UI実装
- [x] シーングラフ基本機能実装
- [ ] シナリオフロー可視化機能（React Flow統合）
- [ ] 基本的なシナリオエディタUI
- [ ] キャラクター・場所・アイテム管理機能
- [ ] データのエクスポート/インポート
- [ ] テンプレート機能
