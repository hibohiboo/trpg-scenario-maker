# TRPG Scenario Maker

TRPGシナリオを可視化しながら作成できるWebアプリケーション

[Demo Page: TRPGシナリオメーカー](https://hibohiboo.github.io/trpg-scenario-maker/)

[コンポーネントカタログ](https://hibohiboo.github.io/trpg-scenario-maker/tsm-components-catalog/)

[テストレポート:vitest](https://hibohiboo.github.io/trpg-scenario-maker/vitest-results/)

[テストレポート:e2e](https://hibohiboo.github.io/trpg-scenario-maker/cucumber-report/)

[Github](https://github.com/hibohiboo/trpg-scenario-maker)

## 概要

TRPG Scenario Makerは、TRPGのシナリオ作成を支援するフロントエンドアプリケーションです。
シナリオの構造を視覚的に整理します。
キャラクター・場所・イベントなどの要素を関連付けながら、シナリオを組み立てることができます。

### 特徴

- **ビジュアルエディタ**: シナリオの流れをフローチャートやマインドマップのように可視化
- **要素管理**: キャラクター、場所、アイテム、イベントなどを一元管理
- **オフライン動作**: バックエンド不要、ブラウザのみで完結
- **データ保存**: IndexedDB（PGlite）によるリレーショナルDBとグラフDB
- **高パフォーマンス**: Web WorkerによるマルチスレッドDB操作
- **GitHub Pages対応**: 無料で公開・共有可能

## 技術スタック

### コア

- **React**: 19.2.2
- **TypeScript**: 型安全性
- **Vite (Rolldown)**: 高速ビルドツール

### データベース・ストレージ

- **PGlite**: ブラウザ内PostgreSQL（IndexedDB backend）
- **Drizzle ORM**: 型安全なORMライブラリ
- **Kuzu-Wasm**: ブラウザ内グラフデータベース（IndexedDB backend）
- **Web Worker**: バックグラウンドスレッドでのDB操作
- **IndexedDB**: ブラウザローカルストレージ（RDB・GraphDB共通）
- **Valibot**: ランタイムバリデーションライブラリ（境界でのデータ検証）

### 開発環境

- **Bun**: 1.3.1+ (パッケージマネージャー)
- **Turbo**: 2.5.8 (モノレポ管理)
- **Vitest**: 4.0.4 (テストフレームワーク)

### コード品質

- **ESLint**: 9.38.0 (リンター)
- **Prettier**: 3.6.2 (フォーマッター)
- **TypeScript ESLint**: 型チェック対応

### UIコンポーネント開発

- **Storybook**: 10.0.1 (コンポーネントカタログ)
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
│   ├── schema/                # バリデーションスキーマ（Valibot）
│   │   └── src/               # エンティティごとのスキーマ定義とパース関数
│   │       ├── scene.ts       # Scene、SceneConnection
│   │       ├── sceneEvent.ts  # SceneEvent
│   │       └── scenario.ts    # Scenario
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

このプロジェクトはVitestを使用してユニットテストを実行します。モノレポ全体のテストを一括で管理できます。

```bash
# 全パッケージのテストを実行
bun test

# UIモードでテストを実行（ブラウザで確認）
bun test:ui

# HTMLレポートを生成
bun test:report
# → bun run test:report-view を行い、 http://localhost:4173/ をブラウザで開く
```

#### テスト設定

- **[vitest.config.ts](vitest.config.ts)**: ルートレベルのVitest設定
  - `projects: ['packages/*']` でpackages配下の全プロジェクトを自動検出
  - カバレッジレポート: HTML、JSON、LCOV形式で出力
  - 各パッケージの `vitest.config.ts` で個別設定（jsdom環境、setupFilesなど）

#### E2Eテスト（BDD）

フロントエンドのE2EテストはCucumber + Playwrightで実装されています。

```bash
cd apps/frontend

# Playwrightブラウザをインストール（初回のみ）
bunx playwright install chromium

# 開発サーバーを起動（別ターミナル）
bun run dev

# E2Eテストを実行
bun run test:e2e
```

テストシナリオは [apps/frontend/tests/features/](apps/frontend/tests/features/) に配置されています。

##### @ignoreタグについて

GitHub Actions では基本的な機能のみ回帰テストを行い、パイプラインの短縮を図っています。基本機能以外のシナリオには `@ignore` タグを付けており、CI実行時にはスキップされます。

```gherkin
@ignore
Scenario: 情報項目を更新する
  Given シナリオ "謎の屋敷" に情報項目 "日記" (説明: "古い日記") が登録されている
  ...
```

**ローカル環境での実行:**

必要なときには、ローカル環境で `@ignore` を外して実施してください。

```bash
# @ignoreタグを含む全てのシナリオを実行
bun run test:e2e -- --tags "not @wip"
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
- **GraphDB（Kuzu-Wasm + IndexedDB）**: シーンの繋がり・関連性（グラフ構造）

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Frontend (Main Thread)                                                      │
│  ┌─────────────┐       ┌──────────────────────┐                              │
│  │ React UI    │◄─────►│ Scene Graph          │                              │
│  └─────────────┘       └──────────┬───────────┘                              │
│                                   │                                          │
│                      ┌────────────▼───────────┐                              │
│                      │ graphdbWorkerClient    │                              │
│                      └────┬───────────────────┘                              │
│                           │                                                  │
└───────────────────────────┼──────────────────────────────────────────────────┘
                            │ postMessage
                   ┌────────▼────────┐
                   │  Web Worker     │
                   │(graphdb.worker) │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐       ┌───────────────────────────┐
                   │  Kuzu-Wasm      │       │  IndexedDB Storage        │
                   │  (Graph Query)  │◄─────►│  (CSV形式保存/復元)        │
                   └────────┬────────┘       └───────────────────────────┘
                            │
                   ┌────────▼───────────────────┐
                   │  VFS (Virtual File System) │
                   │  (メモリ内一時ストレージ)    │
                   └────────────────────────────┘
```

**主要コンポーネント:**

- **[graphdb.worker.ts](apps/frontend/src/workers/graphdb.worker.ts)**: GraphDB WebWorkerメインファイル
- **[graphdbWorkerClient.ts](apps/frontend/src/workers/graphdbWorkerClient.ts)**: GraphDB Workerクライアント
- **[indexedDBStorage.ts](packages/graphdb/src/indexedDBStorage.ts)**: IndexedDBストレージユーティリティ
- **[sceneGraphHandlers.ts](apps/frontend/src/entities/scene/workers/sceneGraphHandlers.ts)**: シーングラフ操作ハンドラー

**永続化の仕組み:**

GraphDBのデータはCSV形式でIndexedDBに保存されます。WebWorker内で以下の処理を実行：

1. **保存**: Kuzu-WasmからCSVエクスポート → IndexedDBに保存
2. **読込**: IndexedDBからCSV取得 → Kuzu-Wasmにインポート
3. **クエリ実行**: メモリ内VFSで高速なグラフクエリ処理

詳細な実装（スキーマ、クエリ例、API使用例）は [apps/frontend/README.md](apps/frontend/README.md) を参照してください。

### データバリデーション（Schema Package）

プロジェクト全体で型安全性とデータ整合性を保つため、`packages/schema`で一元的にバリデーションスキーマを管理しています。

#### 設計方針

- **Valibotを使用したランタイムバリデーション**: TypeScriptの型チェックに加え、実行時にもデータの妥当性を検証
- **境界でのパース**: データがシステムに入る境界（Worker ハンドラー、API レスポンス）で必ずパースを実行
- **型アサーション (`as`) の排除**: 型安全性を損なう `as` キャストを避け、スキーマパースで型を保証

#### パース実施箇所

1. **Worker ハンドラー**: Web Worker受信時に `payload` をパース

   ```typescript
   // 悪い例: 型アサーション使用
   const { sceneId } = payload as { sceneId: string };

   // 良い例: スキーマでパース
   const { sceneId } = parseGetScenesByScenarioIdPayload(payload);
   ```

2. **API レスポンス**: DBからの取得データをパース

   ```typescript
   const scenes = parseSceneListSchema(result);
   ```

3. **nullableフィールドの正規化**: データベースからnullが返る可能性があるフィールドを安全に処理
   ```typescript
   // descriptionがnullの場合、空文字に変換
   const DescriptionSchema = v.pipe(
     v.nullable(v.string()),
     v.transform((value) => value ?? ''),
   );
   ```

#### 主要スキーマファイル

- **[packages/schema/src/scene.ts](packages/schema/src/scene.ts)**: Scene、SceneConnection のスキーマとパース関数
- **[packages/schema/src/sceneEvent.ts](packages/schema/src/sceneEvent.ts)**: SceneEvent のスキーマとパース関数
- **[packages/schema/src/scenario.ts](packages/schema/src/scenario.ts)**: Scenario のスキーマとパース関数

この方針により、型安全性を保ちながら実行時のバリデーションエラーを早期に検出できます。

### レスポンシブデザイン

このアプリケーションは、PC・タブレット・スマートフォンなど様々なデバイスで快適に使用できるよう、レスポンシブデザインを採用しています。

#### シーン編集画面のレイアウト戦略

**PC・タブレット（768px以上）**:

- シーン一覧とシーンフローを横並びで表示（1:3の割合）
- シーンフローにより多くのスペースを割り当て、グラフの視認性を向上
- `md:grid md:grid-cols-4` により、シーン一覧（1列）とシーンフロー（3列）を表示
- 両方の情報を同時に確認可能

**スマートフォン（768px未満）**:

- タブ切り替えによる表示（「シーン一覧」「シーンフロー」タブ）
- シーンフローは横幅が必要なため、全幅で表示することで操作性を向上
- タブでコンテンツを切り替えることで、限られた画面を最大限に活用

**実装のポイント**:

```typescript
// PC: 横並び表示（1:3の割合）
<div className="hidden md:grid md:grid-cols-4 md:gap-4">
  <div className="md:col-span-1">{sceneListContent}</div>
  <div className="md:col-span-3">{sceneFlowContent}</div>
</div>

// スマホ: タブ切り替え
<div className="md:hidden">
  <Tabs tabs={tabs} />
</div>
```

## 機能

### シナリオフロー可視化

React Flowを使用したシーン間の関係性を視覚的に表示・編集できます。

**主な機能:**

- ノードのドラッグ&ドロップによる配置
- ノード間の接続線作成・削除
- マスターシーンの視覚的区別（緑色のハイライト）
- **自動整列機能**: dagreアルゴリズムによる階層的レイアウト
  - 縦方向整列（Top to Bottom）
  - 横方向整列（Left to Right）
- **シーン詳細表示**: サイドバーでシーン説明を表示
  - **Markdown対応**: GitHub Flavored Markdown（GFM）でシーン説明を記述可能
  - 見出し、リスト、表、コードブロックなど豊富な表現をサポート

**使用技術:**

- [@xyflow/react](https://reactflow.dev/) - フローチャートUI
- [@dagrejs/dagre](https://github.com/dagrejs/dagre) - 自動レイアウトアルゴリズム
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdownレンダリング
- [remark-gfm](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdownサポート

### 情報項目管理

シナリオに登場する情報（手がかり、秘密、証拠など）を管理し、シーンとの関連を可視化できます。

**主な機能:**

- 情報項目の作成・編集・削除
- 情報項目同士の関連付け
- シーンで獲得できる情報の設定（Scene → InformationItem）
- 情報が指し示すシーンの設定（InformationItem → Scene）
  - 例：「この情報を手に入れると、次のシーンに行ける」
- **シーングラフ上での情報項目の可視化**
  - 情報項目ノード（琥珀色）の表示
  - 4種類のエッジによる関連性の可視化：
    - 青色（アニメーション）: シーン間の接続
    - オレンジ色: 情報項目同士の接続
    - 緑色（破線）: 情報項目→シーンへの接続（情報が指し示すシーン）
    - 紫色（破線）: シーン→情報項目への接続（シーンで獲得できる情報）

### キャラクター管理

シナリオに登場するキャラクターを管理し、関係性を可視化できます。

**主な機能:**

- キャラクターの作成・編集・削除
- キャラクター画像のアップロード（Data URL形式でRDBに保存）
- キャラクター同士の関係性設定
- シナリオへの登場キャラクター設定
- **キャラクター関係グラフの可視化**
  - キャラクターノード間の関係性を視覚的に表示
  - 関係性の種類（敵対、友好など）を明示

## ロードマップ

-[ ] BDDの残り

- [x] キャラクター管理機能
- [ ] キャラクター画像機能（実装中 #36）
- [ ] 場所管理機能
- [ ] アイテム管理機能
- [ ] データのエクスポート/インポート
- [ ] テンプレート機能
