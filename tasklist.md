# シーンイベント機能実装タスクリスト

## 概要
シーンにイベントを登録できるようにし、フローでシーンタイトルの下にイベントタイプに応じたアイコンを表示する機能を実装します。

## データベーススキーマ
```cypher
CREATE NODE TABLE SceneEvent (
    id STRING,
    type STRING,          -- "start" | "conversation" | "choice" | "battle" | ...
    content STRING,
    sortOrder INT64,
    PRIMARY KEY (id)
);

CREATE REL TABLE HAS_EVENT (
    FROM Scene TO SceneEvent
);
```

## タスク一覧

### 1. バックエンド実装

- [x] **GraphDBスキーマ追加** (`packages/graphdb/src/schemas.ts`)
  - SceneEventノード定義を追加
  - HAS_EVENTリレーション定義を追加

- [x] **型定義作成** (`packages/ui/src/scene/types.ts`)
  - SceneEvent型を定義
  - SceneEventType型を定義（"start" | "conversation" | "choice" | "battle" など）

- [x] **スキーマバリデーション作成** (`packages/schema/src/sceneEvent.ts`)
  - Valibotスキーマでバリデーション定義
  - 型安全性を確保

- [x] **sceneEventRepository実装** (`packages/graphdb/src/queries/sceneEventRepository.ts`)
  - getEventsBySceneId(sceneId: string)
  - createEvent(params)
  - updateEvent(id, updates)
  - deleteEvent(id)
  - updateEventOrder(eventOrders)

- [x] **sceneEventApi実装** (`apps/frontend/src/entities/sceneEvent/api/sceneEventApi.ts`)
  - Worker経由でGraphDB操作
  - 上記リポジトリメソッドをラップ

- [x] **Redux sceneEventSlice作成** (`apps/frontend/src/entities/sceneEvent/model/sceneEventSlice.ts`)
  - State管理（eventsBySceneId、loading、error）
  - reducers定義

- [x] **sceneEventActions実装** (`apps/frontend/src/entities/sceneEvent/actions/sceneEventActions.ts`)
  - readEventsAction(sceneId)
  - createEventAction({sceneId, event})
  - updateEventAction({sceneId, id, updates})
  - deleteEventAction({sceneId, eventId})
  - updateEventOrderAction({sceneId, eventOrders})

### 2. フロントエンド実装（表示）

- [x] **SceneEventアイコンコンポーネント作成** (`packages/ui/src/scene/SceneEventIcon.tsx`)
  - typeに応じたアイコン表示（react-icons使用）
  - start: FaPlay
  - conversation: FaComments
  - choice: FaCodeBranch
  - battle: FaCrosshairs
  - その他のイベントタイプも定義

- [x] **flowUtils拡張** (`packages/ui/src/scene/canvas/flowUtils.ts`)
  - scenesToNodes関数にイベント情報を含める
  - ノードデータにeventsプロパティを追加
  - カスタムノードコンポーネント用のデータ構造

- [x] **カスタムSceneNodeコンポーネント作成** (`packages/ui/src/scene/canvas/SceneNode.tsx`)
  - シーンタイトル表示
  - 配下のイベントアイコンを横並びで表示
  - ReactFlowのカスタムノードとして登録

### 3. フロントエンド実装（編集UI）⭐ **未実装**

- [ ] **SceneEventFormコンポーネント作成** (`packages/ui/src/scene/SceneEventForm.tsx`)
  - イベントタイプ選択（select/radio）
  - イベント内容入力（textarea）
  - 保存・キャンセルボタン

- [ ] **SceneFormにイベント管理セクション追加** (`packages/ui/src/scene/SceneForm.tsx`)
  - イベント一覧表示（各イベントのアイコン、タイプ、内容）
  - イベント追加ボタン → SceneEventFormを開く
  - 各イベントの編集ボタン → SceneEventFormを開く
  - 各イベントの削除ボタン
  - イベント順序変更UI（上下ボタンまたはドラッグ&ドロップ）

- [ ] **useSceneEventOperations Hook作成** (`apps/frontend/src/entities/sceneEvent/hooks/useSceneEventOperations.ts`)
  - Redux actionsをラップ
  - イベント追加・更新・削除・順序変更の操作を提供

- [ ] **SceneEditor統合** (`packages/ui/src/scene/SceneEditor.tsx`)
  - SceneFormにイベント管理機能を統合
  - シーン保存時にイベントも一緒に保存

### 4. Storybook追加

- [x] **SceneEventIconストーリー作成** (`packages/ui/src/scene/SceneEventIcon.stories.tsx`)
  - 各イベントタイプのストーリー
  - サイズバリエーション
  - カラーバリエーション

- [x] **SceneNodeストーリー作成** (`packages/ui/src/scene/canvas/SceneNode.stories.tsx`)
  - イベントなしシーン
  - 単一イベント
  - 複数イベント
  - 全イベントタイプ表示

- [x] **SceneFlowCanvasストーリー追加** (`packages/ui/src/scene/SceneFlowCanvas.stories.tsx`)
  - WithEvents: イベント付きシーンのフロー
  - WithEventsComplexFlow: 複雑な分岐を持つイベント付きフロー

- [ ] **SceneEventFormストーリー作成** (`packages/ui/src/scene/SceneEventForm.stories.tsx`)
  - 新規作成モード
  - 編集モード
  - バリデーションエラー表示

### 5. テスト・検証

- [x] **Storybookサンプルデータ追加** (`packages/ui/src/scene/__fixtures__/scenes.ts`)
  - scenesWithEvents配列を追加
  - 各イベントタイプのサンプル

- [x] **lint・型チェック実行**
  - `bun run lint` - 通過
  - TypeScriptエラー確認 - 通過

- [x] **ビルド確認**
  - `bun run build` - 成功

### 6. ドキュメント更新

- [ ] **README更新** (`packages/ui/src/scene/README.md`)
  - SceneEvent機能の説明を追加
  - 使用方法の記載
  - イベント追加・編集・削除の手順

- [ ] **プロジェクトREADME更新** (`readme.md`)
  - ロードマップにイベント機能（表示）完了をチェック
  - イベント編集機能は次フェーズとして記載

## 実装順序

### ✅ フェーズ1: 表示機能（完了）
1. バックエンド基盤（スキーマ → 型 → リポジトリ → API → Redux）
2. フロントエンド表示（アイコン → カスタムノード → flowUtils拡張）
3. Storybook（SceneEventIcon, SceneNode, SceneFlowCanvas）
4. テスト・検証（lint、型チェック、ビルド）

### ⭐ フェーズ2: 編集UI機能（未実装）
1. SceneEventFormコンポーネント作成
2. SceneFormへのイベント管理セクション追加
3. useSceneEventOperations Hook作成
4. SceneEditor統合
5. Storybook追加（SceneEventForm）
6. テスト・検証
7. ドキュメント更新

## 注意事項

- 改行コードは全てLFで統一
- TypeScript型安全性を維持
- 既存のScene機能に影響を与えないよう注意
- イベントの順序管理（sortOrder）を適切に実装
