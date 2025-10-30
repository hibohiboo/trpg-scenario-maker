# キャラクター関係管理機能 タスクリスト

## 目標
- キャラクターをグラフDBで管理
- キャラクター間の関係を双方向の矢印で表示（A→BとB→Aは別管理）
- 矢印に関係名を表示
- キャラクター要素：ID、名前、説明

## 進捗状況

### ✅ 完了（バックエンド・API層）
- [x] キャラクター・関係性のスキーマ定義（Valibot）
- [x] グラフDBスキーマ追加（Character/Relationshipノード・エッジ）
- [x] キャラクターリポジトリ実装（CRUD操作）
- [x] 関係性リポジトリ実装（双方向関係管理）
- [x] 統合テスト実装・実行
- [x] lint・型チェック実行
- [x] フロントエンドAPI実装（graphdbWorkerClient経由）
- [x] Workerハンドラー実装・統合
- [x] 型推論機能追加（GlobalHandlerMap）

### ✅ 完了（状態管理・Hooks層）
- [x] キャラクター用Redux Slice実装（characterSlice.ts）
- [x] キャラクター一覧取得Hook実装（useCharacterList）
- [x] 関係性用Redux Slice実装（relationshipSlice.ts）
- [x] 関係性操作用Hooks実装
  - [x] useCharacterRelationships（キャラクターの関係性取得）
  - [x] useCreateRelationship（関係性作成）
  - [x] useUpdateRelationship（関係性更新）
  - [x] useDeleteRelationship（関係性削除）
  - [x] useAllRelationships（全関係性取得）

### ✅ 完了（UI層 - コンポーネント）
- [x] UIコンポーネント実装
  - [x] CharacterList（キャラクター一覧表示）
  - [x] RelationshipList（関係性一覧表示）
  - [x] RelationshipForm（関係性作成/編集フォーム）
  - [x] DeleteRelationshipModal（削除確認モーダル）
  - [x] CharacterRelationshipPage（統合ページコンポーネント）
- [x] types定義（Character, Relationship, RelationshipFormData）
- [x] uiパッケージへのexport設定

### 🚧 作業中（UI層 - ページ統合）
- [ ] フロントエンドページ実装（containers層）
  - [ ] useCharacterRelationshipPageフック作成
  - [ ] CharacterRelationshipPageコンテナ作成
- [ ] ルーティング追加
  - [ ] /charactersルート追加
  - [ ] ナビゲーションメニュー追加
- [ ] 動作確認・デバッグ

### 📝 未着手（テスト・グラフ可視化）
- [ ] 基本機能の動作確認
- [ ] RelationshipGraph（関係性グラフ可視化）実装
- [ ] BDDテスト作成・実行

## 技術スタック
- グラフDB: Kùzu WASM（既存）
- スキーマ検証: Valibot
- フロントエンド: React
- グラフ可視化: TBD（react-flow, cytoscape.js等を検討）

## 設計方針
- 双方向関係は別エッジとして管理（A→BとB→Aは独立）
- 関係名はエッジのプロパティとして保存
- グラフDBを活用した柔軟なクエリを実現

## 次に行うタスク（優先度順）

### 1. フロントエンドページ統合 🔥
**ファイル**:
- `apps/frontend/src/entities/character/hooks/useCharacterRelationshipPage.ts`
- `apps/frontend/src/entities/character/containers/CharacterRelationshipPage.tsx`
- `apps/frontend/src/page/characters/ui/Page.tsx`

**実装内容**:
- `useCharacterRelationshipPage`: ページロジックを統合するHook
  - useCharacterList, useAllRelationships, useCreateRelationship等を統合
  - モーダル開閉ロジック
  - フォーム状態管理
- CharacterRelationshipPageコンテナ: UIコンポーネントとHookを接続
- Page.tsx: ルーティング用のre-export

**依存関係**:
- ✅ relationshipSlice（実装済み）
- ✅ 関係性Hooks（実装済み）
- ✅ UIコンポーネント（実装済み）

### 2. ルーティング追加 🔥
**ファイル**:
- `apps/frontend/src/app/routes/index.tsx`
- `apps/frontend/src/app/Router.tsx`（またはApp.tsx）

**実装内容**:
- `/characters`ルート追加
- ナビゲーションメニューに「キャラクター管理」リンク追加

**依存関係**:
- ⏳ CharacterRelationshipPageコンテナ（タスク1）

### 3. 動作確認・デバッグ
**確認項目**:
- キャラクター一覧が正しく表示されるか
- 関係性一覧が正しく表示されるか
- 関係性の作成が動作するか
- 関係性の編集が動作するか
- 関係性の削除が動作するか
- モーダルの開閉が正しく動作するか
- バリデーションが正しく動作するか

### 4. BDDテスト実装
**テストシナリオ**:
- キャラクター表示
- 関係性の作成・編集・削除
- 双方向関係の管理
- エラーハンドリング

**依存関係**:
- ⏳ ページ統合・動作確認（タスク3）

### 5. グラフ可視化実装（オプション）
**実装内容**:
- react-flowまたはcytoscape.jsを使用
- キャラクター間の関係を視覚的に表示
- インタラクティブなノード操作

**依存関係**:
- ⏳ 基本機能の動作確認（タスク3）

## 実装状況サマリー

| レイヤー | 状態 | 完了率 |
|---------|------|--------|
| スキーマ層（Valibot） | ✅完了 | 100% |
| GraphDB層（リポジトリ） | ✅完了 | 100% |
| Worker層（ハンドラー） | ✅完了 | 100% |
| API層（フロントエンド） | ✅完了 | 100% |
| 状態管理層（Redux） | ✅完了 | 100% (Character, Relationship両方完了) |
| Hooks層 | ✅完了 | 100% (全Hooks実装済み) |
| UI層（コンポーネント） | ✅完了 | 100% (基本コンポーネント完了) |
| ページ統合層 | 🚧作業中 | 0% (次のタスク) |
| ルーティング層 | 🚧作業中 | 0% (次のタスク) |
| テスト層（BDD） | ❌未着手 | 0% |

## 実装完了したファイル一覧

### バックエンド層
- ✅ `packages/schema/src/character.ts` - Character型定義
- ✅ `packages/schema/src/relationship.ts` - Relationship型定義
- ✅ `packages/graphdb/src/schemas.ts` - GraphDBスキーマ
- ✅ `packages/graphdb/src/queries/characterRepository.ts` - CRUDリポジトリ
- ✅ `packages/graphdb/src/queries/characterRelationshipGraphRepository.ts` - 関係性リポジトリ

### フロントエンド - Worker/API層
- ✅ `apps/frontend/src/entities/character/api/characterGraphApi.ts`
- ✅ `apps/frontend/src/entities/character/api/characterRelationGraphApi.ts`
- ✅ `apps/frontend/src/entities/character/workers/characterGraphHandlers.ts`
- ✅ `apps/frontend/src/entities/character/workers/characterRelationGraphHandlers.ts`
- ✅ `apps/frontend/src/workers/types/handlerMaps.ts` - GlobalHandlerMap統合型
- ✅ `apps/frontend/src/workers/graphdbWorkerClient.ts` - 型推論機能追加

### フロントエンド - Redux/Hooks層
- ✅ `apps/frontend/src/entities/character/model/characterSlice.ts`
- ✅ `apps/frontend/src/entities/character/model/relationshipSlice.ts`
- ✅ `apps/frontend/src/entities/character/actions/characterActions.ts`
- ✅ `apps/frontend/src/entities/character/actions/relationshipActions.ts`
- ✅ `apps/frontend/src/entities/character/hooks/useCharacterList.ts`
- ✅ `apps/frontend/src/entities/character/hooks/useAllRelationships.ts`
- ✅ `apps/frontend/src/entities/character/hooks/useCharacterRelationships.ts`
- ✅ `apps/frontend/src/entities/character/hooks/useCreateRelationship.ts`
- ✅ `apps/frontend/src/entities/character/hooks/useUpdateRelationship.ts`
- ✅ `apps/frontend/src/entities/character/hooks/useDeleteRelationship.ts`

### UI層
- ✅ `packages/ui/src/character/types.ts`
- ✅ `packages/ui/src/character/CharacterList.tsx`
- ✅ `packages/ui/src/character/RelationshipList.tsx`
- ✅ `packages/ui/src/character/RelationshipForm.tsx`
- ✅ `packages/ui/src/character/DeleteRelationshipModal.tsx`
- ✅ `packages/ui/src/character/CharacterRelationshipPage.tsx`
- ✅ `packages/ui/src/character/index.ts`
- ✅ `packages/ui/src/index.ts` - export設定
