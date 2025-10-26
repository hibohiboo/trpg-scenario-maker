# シーンイベント機能実装タスクリスト

## 概要
シーンにイベントを登録できるようにし、フローでシーンタイトルの下にイベントタイプに応じたアイコンを表示する機能を実装します。

## データベーススキーマ
```cypher
CREATE NODE TABLE SceneEvent (
    id STRING,
    type STRING,          -- "start" | "conversation" | "choice" | "battle" | ...
    content STRING,
    order INT64,
    PRIMARY KEY (id)
);

CREATE REL TABLE HAS_EVENT (
    FROM Scene TO SceneEvent
);
```

## タスク一覧

### 1. バックエンド実装

- [ ] **GraphDBスキーマ追加** (`packages/graphdb/src/schemas.ts`)
  - SceneEventノード定義を追加
  - HAS_EVENTリレーション定義を追加

- [ ] **型定義作成** (`packages/ui/src/scene/types.ts`)
  - SceneEvent型を定義
  - SceneEventType型を定義（"start" | "conversation" | "choice" | "battle" など）

- [ ] **スキーマバリデーション作成** (`packages/schema/src/sceneEvent.ts`)
  - Zodスキーマでバリデーション定義
  - 型安全性を確保

- [ ] **sceneEventRepository実装** (`packages/graphdb/src/queries/sceneEventRepository.ts`)
  - getEventsBySceneId(sceneId: string)
  - createEvent(params)
  - updateEvent(id, updates)
  - deleteEvent(id)
  - updateEventOrder(sceneId, eventIds)

- [ ] **sceneEventApi実装** (`apps/frontend/src/entities/sceneEvent/api/sceneEventApi.ts`)
  - Worker経由でGraphDB操作
  - 上記リポジトリメソッドをラップ

- [ ] **Redux sceneEventSlice作成** (`apps/frontend/src/entities/sceneEvent/model/sceneEventSlice.ts`)
  - State管理（events配列、loading、error）
  - reducers定義

- [ ] **sceneEventActions実装** (`apps/frontend/src/entities/sceneEvent/actions/sceneEventActions.ts`)
  - readEventsAction(sceneId)
  - createEventAction({sceneId, event})
  - updateEventAction({id, updates})
  - deleteEventAction(id)
  - updateEventOrderAction({sceneId, eventIds})

### 2. フロントエンド実装

- [ ] **SceneEventアイコンコンポーネント作成** (`packages/ui/src/scene/SceneEventIcon.tsx`)
  - typeに応じたアイコン表示（react-icons使用）
  - start: FaPlay
  - conversation: FaComments
  - choice: FaCodeBranch
  - battle: FaCrosshairs
  - その他のイベントタイプも定義

- [ ] **flowUtils拡張** (`packages/ui/src/scene/canvas/flowUtils.ts`)
  - scenesToNodes関数にイベント情報を含める
  - ノードデータにeventsプロパティを追加
  - カスタムノードコンポーネント用のデータ構造

- [ ] **カスタムSceneNodeコンポーネント作成** (`packages/ui/src/scene/canvas/SceneNode.tsx`)
  - シーンタイトル表示
  - 配下のイベントアイコンを横並びで表示
  - ReactFlowのカスタムノードとして登録

- [ ] **SceneFormにイベント追加フィールド実装** (`packages/ui/src/scene/SceneForm.tsx`)
  - イベント一覧表示
  - イベント追加UI
  - イベント削除UI
  - イベント順序変更UI（ドラッグ&ドロップまたは上下ボタン）

### 3. テスト・検証

- [ ] **Storybookサンプル追加** (`packages/ui/src/scene/__fixtures__/sceneEvents.ts`)
  - サンプルイベントデータ作成
  - SceneNodeストーリー追加
  - SceneFlowCanvasでイベント表示のストーリー追加

- [ ] **lint・型チェック実行**
  - `bun run lint`
  - TypeScriptエラー確認

- [ ] **ビルド確認**
  - `bun run build`
  - ビルドエラーがないことを確認

### 4. ドキュメント更新

- [ ] **README更新** (`packages/ui/src/scene/README.md`)
  - SceneEvent機能の説明を追加
  - 使用方法の記載

- [ ] **プロジェクトREADME更新** (`readme.md`)
  - ロードマップにイベント機能完了をチェック

## 実装順序

1. バックエンド基盤（スキーマ → 型 → リポジトリ → API → Redux）
2. フロントエンド表示（アイコン → カスタムノード → flowUtils拡張）
3. フロントエンド編集（SceneForm拡張）
4. テスト・検証
5. ドキュメント更新

## 注意事項

- 改行コードは全てLFで統一
- TypeScript型安全性を維持
- 既存のScene機能に影響を与えないよう注意
- イベントの順序管理（order）を適切に実装
