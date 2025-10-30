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

### 🚧 作業中（状態管理・Hooks層）
- [x] キャラクター用Redux Slice実装（characterSlice.ts）
- [x] キャラクター一覧取得Hook実装（useCharacterList）
- [ ] 関係性用Redux Slice実装（relationshipSlice.ts）
- [ ] 関係性操作用Hooks実装
  - [ ] useCharacterRelationship（キャラクターの関係性取得）
  - [ ] useCreateRelationship（関係性作成）
  - [ ] useUpdateRelationship（関係性更新）
  - [ ] useDeleteRelationship（関係性削除）
  - [ ] useAllRelationships（全関係性取得）

### 📝 未着手（UI層）
- [ ] UIコンポーネント実装
  - [ ] CharacterList（キャラクター一覧表示）
  - [ ] CharacterForm（キャラクター作成/編集フォーム）
  - [ ] CharacterModal（作成/編集/削除モーダル）
  - [ ] RelationshipList（関係性一覧表示）
  - [ ] RelationshipForm（関係性作成/編集フォーム）
  - [ ] RelationshipModal（関係性管理モーダル）
  - [ ] RelationshipGraph（関係性グラフ可視化）
- [ ] 関係性管理ページ統合
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

### 1. 関係性用Redux Slice実装 🔥
**ファイル**: `apps/frontend/src/entities/character/model/relationshipSlice.ts`

**実装内容**:
- State型定義（RelationshipState）
- Async Thunk実装
  - `createRelationshipAction`: 関係性作成
  - `updateRelationshipAction`: 関係性更新
  - `deleteRelationshipAction`: 関係性削除
  - `readRelationshipsByCharacterIdAction`: キャラクターの関係性取得
  - `readAllRelationshipsAction`: 全関係性取得
- Reducer実装（pending/fulfilled/rejected処理）
- 既存のcharacterSliceを参考に実装

**依存関係**:
- ✅ `characterRelationGraphApi`（実装済み）
- ✅ `GlobalHandlerMap`（実装済み）

### 2. 関係性操作用Hooks実装 🔥
**ファイル**: `apps/frontend/src/entities/character/hooks/`

**実装するHook**:
1. `useCharacterRelationship(characterId)`: キャラクターの関係性取得
2. `useCreateRelationship()`: 関係性作成処理
3. `useUpdateRelationship()`: 関係性更新処理
4. `useDeleteRelationship()`: 関係性削除処理
5. `useAllRelationships()`: 全関係性取得

**依存関係**:
- ⏳ relationshipSlice（タスク1で実装）

### 3. UIコンポーネント実装
**実装順序**:
1. `CharacterList`: キャラクター一覧表示（useCharacterList使用）
2. `CharacterForm`: キャラクター作成/編集フォーム
3. `RelationshipList`: 関係性一覧表示（useAllRelationships使用）
4. `RelationshipForm`: 関係性作成/編集フォーム
5. `RelationshipGraph`: グラフ可視化（react-flowまたはcytoscape.js使用）

**依存関係**:
- ⏳ relationshipSlice（タスク1）
- ⏳ 関係性Hooks（タスク2）

### 4. BDDテスト実装
**テストシナリオ**:
- キャラクター作成・編集・削除
- 関係性の作成・編集・削除
- 双方向関係の管理
- グラフ可視化の動作確認

**依存関係**:
- ⏳ UIコンポーネント（タスク3）

## 実装状況サマリー

| レイヤー | 状態 | 完了率 |
|---------|------|--------|
| スキーマ層（Valibot） | ✅完了 | 100% |
| GraphDB層（リポジトリ） | ✅完了 | 100% |
| Worker層（ハンドラー） | ✅完了 | 100% |
| API層（フロントエンド） | ✅完了 | 100% |
| 状態管理層（Redux） | 🚧作業中 | 50% (Character完了、Relationship未実装) |
| Hooks層 | 🚧作業中 | 20% (useCharacterListのみ) |
| UI層（コンポーネント） | ❌未着手 | 0% |
| テスト層（BDD） | ❌未着手 | 0% |
