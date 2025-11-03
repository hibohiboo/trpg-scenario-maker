# シナリオ×キャラクター関係管理機能 実装記録

## 実装完了日
2025-11-03

## 実装された機能
- シナリオへのキャラクター登場関係の管理（APPEARS_IN）
- シナリオ内でのキャラクター間関係の管理（RELATES_IN_SCENARIO）
- キャラクターの役割（role）管理
- シナリオごとのキャラクター一覧表示
- UIコンポーネントとStorybookストーリー

## アーキテクチャ概要

### 全体構成
```
Backend Layer (GraphDB + Schema)
  ↓
Worker Layer (Web Worker)
  ↓
API Layer (graphdbWorkerClient)
  ↓
Actions Layer (Redux Async Thunks)
  ↓
Model Layer (Redux Slice)
  ↓
Hooks Layer (Custom Hooks)
  ↓
UI Layer (React Components)
```

### データモデル

#### APPEARS_IN エッジ
```cypher
CREATE REL TABLE APPEARS_IN (
  FROM Character TO Scenario,
  role STRING
)
```
- キャラクターがシナリオに登場する関係を表現
- `role`プロパティで役割を管理（例: "主人公", "協力者", "敵"）

#### RELATES_IN_SCENARIO エッジ
```cypher
CREATE REL TABLE RELATES_IN_SCENARIO (
  FROM Character TO Character,
  scenarioId STRING,
  relationshipName STRING
)
```
- シナリオ固有のキャラクター間関係を表現
- 同じキャラクターペアでもシナリオごとに異なる関係を定義可能

## 実装ファイル一覧

### Backend層

#### スキーマ定義
- **packages/schema/src/scenarioCharacter.ts**
  - `ScenarioCharacterSchema`: シナリオ×キャラクター関係のスキーマ
  - Valibotによる型安全なバリデーション
  - `parseToScenarioCharacterList`: 配列パース関数

- **packages/schema/src/scenarioCharacterRelationship.ts**
  - `ScenarioCharacterRelationshipSchema`: シナリオ内キャラクター関係のスキーマ
  - `parseToScenarioCharacterRelationshipList`: 配列パース関数

#### GraphDB層
- **packages/graphdb/src/schemas.ts**
  - `APPEARS_IN`エッジテーブル定義を追加
  - `RELATES_IN_SCENARIO`エッジテーブル定義を追加

- **packages/graphdb/src/queries/scenarioCharacterRepository.ts**
  - `addCharacterToScenario`: キャラクターをシナリオに追加
  - `removeCharacterFromScenario`: キャラクターをシナリオから削除
  - `updateCharacterRole`: キャラクターの役割を更新
  - `listCharactersInScenario`: シナリオに登場するキャラクター一覧取得

- **packages/graphdb/src/queries/scenarioCharacterRelationshipRepository.ts**
  - `createRelationshipInScenario`: シナリオ内の関係を作成
  - `updateRelationshipInScenario`: シナリオ内の関係を更新
  - `deleteRelationshipInScenario`: シナリオ内の関係を削除
  - `listRelationshipsInScenario`: シナリオ内の関係一覧取得

- **packages/graphdb/src/queries/scenarioCharacterRepository.test.ts**
  - 9つのテストケース（全てパス）
  - キャラクター追加・削除・役割更新のテスト
  - 関係作成・更新・削除のテスト

### Frontend層

#### Worker層
- **apps/frontend/src/entities/scenarioCharacter/workers/scenarioCharacterGraphHandlers.ts**
  - 4つのハンドラー（add, remove, update, list）
  - GraphDBリポジトリへの橋渡し

- **apps/frontend/src/entities/scenarioCharacter/workers/scenarioCharacterRelationGraphHandlers.ts**
  - 4つのハンドラー（create, update, delete, list）
  - リレーションシップ管理用

#### API層
- **apps/frontend/src/entities/scenarioCharacter/api/scenarioCharacterGraphApi.ts**
  - `graphdbWorkerClient`を使った型安全なAPI呼び出し
  - 4つのAPIメソッド

- **apps/frontend/src/entities/scenarioCharacter/api/scenarioCharacterRelationGraphApi.ts**
  - リレーションシップ用APIメソッド
  - 4つのAPIメソッド

#### Actions層
- **apps/frontend/src/entities/scenarioCharacter/actions/scenarioCharacterActions.ts**
  - `addCharacterToScenarioAction`: キャラクター追加アクション
  - `removeCharacterFromScenarioAction`: キャラクター削除アクション
  - `updateCharacterRoleAction`: 役割更新アクション
  - `fetchScenarioCharactersAction`: 一覧取得アクション
  - `createRelationshipInScenarioAction`: 関係作成アクション
  - `updateRelationshipInScenarioAction`: 関係更新アクション
  - `deleteRelationshipInScenarioAction`: 関係削除アクション
  - `fetchScenarioCharacterRelationshipsAction`: 関係一覧取得アクション

#### Model層
- **apps/frontend/src/entities/scenarioCharacter/model/scenarioCharacterSlice.ts**
  - シナリオIDをキーとした状態管理
  - `charactersByScenario: Record<scenarioId, ScenarioCharacter[]>`
  - `relationsByScenario: Record<scenarioId, ScenarioCharacterRelationship[]>`
  - `isLoading`/`isSubmitting`フラグ
  - セレクター: `scenarioCharactersSelector`, `scenarioCharacterRelationsSelector`

#### Hooks層
- **apps/frontend/src/entities/scenarioCharacter/hooks/useScenarioCharacters.ts**
  - `useScenarioCharacters`: キャラクター一覧と操作関数を提供
  - 自動的にデータをフェッチ
  - ローディング状態管理

- **apps/frontend/src/entities/scenarioCharacter/hooks/useScenarioCharacterRelations.ts**
  - `useScenarioCharacterRelations`: 関係一覧と操作関数を提供
  - 自動的にデータをフェッチ
  - サブミット状態管理

#### Store統合
- **apps/frontend/src/app/store/rootReducer.ts**
  - `scenarioCharacterSlice.reducer`を追加

- **apps/frontend/src/workers/types/handlerMaps.ts**
  - `GlobalHandlerMap`に型定義を追加
  - 型安全なWorker API呼び出しを実現

### UI層

#### コンポーネント
- **packages/ui/src/scenarioCharacter/ScenarioCharacterList.tsx**
  - シナリオに登場するキャラクターの一覧表示
  - 役割バッジ表示
  - 新規作成・既存追加・削除ボタン
  - ローディング/空状態の対応

- **packages/ui/src/scenarioCharacter/types.ts**
  - `CharacterWithRole`型定義（roleを含む）

- **packages/ui/src/scenarioCharacter/index.ts**
  - エクスポート定義

#### Storybook
- **packages/ui/src/scenarioCharacter/ScenarioCharacterList.stories.tsx**
  - 9つのストーリーバリエーション:
    - `Default`: 基本表示（3キャラクター）
    - `Loading`: ローディング状態
    - `Empty`: 空状態
    - `WithoutRole`: 役割なし
    - `SingleCharacter`: 1キャラクターのみ
    - `NoDescription`: 説明なし
    - `ManyCharacters`: 多数のキャラクター（6人）
    - `LongDescription`: 長い説明文
    - `WithoutRemoveButton`: 削除ボタンなし
    - `WithoutCreateButton`: 新規作成ボタンなし
    - `WithoutAddExistingButton`: 既存追加ボタンなし

### BDD
- **apps/frontend/tests/features/scenario-character.feature**
  - 5つのシナリオ:
    1. シナリオ内でキャラクターを新規作成して追加する
    2. シナリオからキャラクターを削除する
    3. シナリオ内のキャラクターの役割を編集する
    4. シナリオ内でキャラクター同士の関係を作成する
    5. シナリオ内のキャラクター関係を編集・削除する

## 技術的課題と解決策

### 課題1: RELATES_IN_SCENARIO vs CHARACTER_RELATES_TO
**課題**: 既存のグローバルな`CHARACTER_RELATES_TO`を使うか、シナリオ固有の`RELATES_IN_SCENARIO`を作るか

**分析**:
- ユーザー要件: 同じキャラクターペアでもシナリオごとに異なる関係を持つ
- 例: キャラクターAとBが「シナリオX」では友人、「シナリオY」では敵対関係

**解決策**:
- `RELATES_IN_SCENARIO`を新規実装
- `scenarioId`をプロパティとして持たせることで完全な分離を実現
- 後から追加すると既存データのマイグレーションが必要になるため、初期段階で実装

**メリット**:
- データの明確な分離
- パフォーマンス向上（シナリオIDでフィルタリング不要）
- 将来的な拡張性

### 課題2: Redux状態の構造設計
**課題**: シナリオごとのデータをどう管理するか

**候補**:
1. フラット配列 + フィルタリング: `characters: ScenarioCharacter[]`
2. シナリオIDキー: `charactersByScenario: Record<scenarioId, ScenarioCharacter[]>`

**解決策**:
- オプション2を採用
- O(1)でのアクセスを実現
- セレクターでの効率的な取得

**実装**:
```typescript
export interface ScenarioCharacterState {
  charactersByScenario: Record<string, ScenarioCharacter[]>;
  relationsByScenario: Record<string, ScenarioCharacterRelationship[]>;
  isLoading: boolean;
  isSubmitting: boolean;
}
```

### 課題3: Worker通信の型安全性
**課題**: 新しいハンドラーを追加した際に型エラーが発生

**エラー内容**:
```
Argument of type '"scenarioCharacter:graph:addToScenario"' is not assignable to parameter
```

**原因**:
- `GlobalHandlerMap`に新しいハンドラー型が含まれていない
- TypeScriptが新しいハンドラータイプを認識できない

**解決策**:
`apps/frontend/src/workers/types/handlerMaps.ts`を更新:
```typescript
export type GlobalHandlerMap = CharacterGraphHandlerMap &
  CharacterRelationGraphHandlerMap &
  ScenarioGraphHandlerMap &
  ScenarioCharacterGraphHandlerMap &  // 追加
  ScenarioCharacterRelationGraphHandlerMap &  // 追加
  SceneGraphHandlerMap &
  SceneEventHandlerMap;
```

**メリット**:
- 完全な型推論とIntelliSense
- コンパイル時の型安全性保証

### 課題4: Bun test実行時のKùzu WASM互換性
**課題**: `bun test`でKùzu WASMが動作しない

**エラー**:
```
kuzu.Database is not a function
```

**解決策**:
- `bun run test`を使用（内部でvitestを実行）
- Vitestの環境がKùzu WASMと互換性がある

**結果**: 全9テストがパス

## YAGNI原則に基づく実装判断

### 実装したもの
✅ CRUD操作の基本機能
✅ GraphDBスキーマとリポジトリ
✅ Redux統合（Entity層フルスタック）
✅ 基本UIコンポーネント
✅ Storybookストーリー
✅ BDD Feature定義

### 意図的に実装しなかったもの
❌ モーダルダイアログコンポーネント（必要になってから実装）
❌ 関係性グラフビジュアライゼーション（必要になってから実装）
❌ 高度なフィルタリング・ソート機能（必要になってから実装）
❌ キャラクター詳細編集フォーム（既存のキャラクター編集機能を流用予定）
❌ ドラッグ&ドロップUI（必要になってから実装）

### YAGNI判断の根拠
- **Feature要件**: 「シナリオ内でキャラクターを新規作成」が主な要求
- **既存機能の再利用**: キャラクター作成・編集は既存のCharacterエンティティを活用
- **段階的実装**: まずバックエンド・Entity層を完成させ、UI統合は次フェーズ

## 使用技術スタック

### Backend
- **Kùzu WASM**: グラフデータベース
- **Valibot**: スキーマバリデーション
- **TypeScript**: 型安全性

### Frontend
- **Redux Toolkit**: 状態管理
- **Web Worker**: バックグラウンド処理
- **Custom Hooks**: ロジック再利用

### UI
- **React**: UIフレームワーク
- **Tailwind CSS**: スタイリング
- **Storybook**: コンポーネント開発

### Testing
- **Vitest**: ユニットテスト
- **Cucumber**: BDDテスト定義

## テスト結果

### Backend単体テスト
```
✓ packages/graphdb/src/queries/scenarioCharacterRepository.test.ts (9)
  ✓ ScenarioCharacter Repository (9)
    ✓ キャラクターをシナリオに追加できる
    ✓ キャラクターをシナリオから削除できる
    ✓ キャラクターの役割を更新できる
    ✓ シナリオに登場するキャラクター一覧を取得できる
    ✓ シナリオ内のキャラクター関係を作成できる
    ✓ シナリオ内のキャラクター関係を更新できる
    ✓ シナリオ内のキャラクター関係を削除できる
    ✓ シナリオ内のキャラクター関係一覧を取得できる
    ✓ 存在しないシナリオIDで関係一覧を取得すると空配列を返す

Test Files  1 passed (1)
     Tests  9 passed (9)
```

### Frontend型チェック・Lint
```
✓ apps/frontend: tsc -b
✓ packages/ui: eslint . --fix && tsc -b
```

### Storybook検証
- ✅ http://localhost:6006/ で全9ストーリーを目視確認
- ✅ ローディング状態、空状態、各種バリエーションの表示確認

## 次のステップ（未実装）

### 1. BDD Steps実装
- `apps/frontend/tests/step-definitions/scenario-character.steps.ts`
- Featureファイルで定義された5シナリオの自動テスト実装

### 2. シナリオ編集画面への統合
- `ScenarioCharacterList`コンポーネントをシナリオ詳細ページに配置
- キャラクター作成モーダルの実装（必要な場合）
- 既存キャラクター追加機能の実装（必要な場合）

### 3. オプショナル機能（YAGNI判断で保留中）
- 関係性グラフビジュアライゼーション
- 高度な検索・フィルタリング
- ドラッグ&ドロップでの役割変更

## 設計上の制約事項

### データ制約
- `scenarioId`と`characterId`の組み合わせはユニーク（GraphDBの制約）
- `RELATES_IN_SCENARIO`は有向グラフ（Character → Character）
- 役割（role）は空文字列が許可される

### パフォーマンス考慮事項
- シナリオごとにデータをキャッシュ（Redux state）
- Worker経由での非同期処理によるUI blocking回避
- 大量キャラクター表示時のレンダリング最適化は未実装（必要になってから対応）

### 今後の拡張性
- シナリオテンプレート機能（キャラクター一式をコピー）
- キャラクター役割のプリセット機能
- 関係性の強度・種類の拡張（友好度など）

## 参考資料
- 既存実装: `docs/character-relation-implementation.md`
- GraphDBスキーマ: `packages/graphdb/src/schemas.ts`
- Feature仕様: `apps/frontend/tests/features/scenario-character.feature`
