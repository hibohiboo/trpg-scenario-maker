# シナリオ×キャラクター関係管理機能 実装タスクリスト

## 目標

シナリオに登場するキャラクターを登録し、そのシナリオ内での関係を管理できるようにする

## 前提条件

- キャラクター管理機能は既に実装済み（[character-relation-implementation.md](docs/character-relation-implementation.md)参照）
- シナリオ管理機能は既に実装済み
- グラフDB（Kùzu WASM）を使用

## 実装方針

1. シナリオとキャラクターの関連付け（APPEARS_IN関係）を追加
2. シナリオ固有のキャラクター関係性（RELATES_IN_SCENARIO）を管理
3. 既存のキャラクター関係（RELATES_TO）とは別に、シナリオごとの関係を扱う

## タスク一覧

### Phase 1: スキーマ設計 ✅

- [x] **1-1. スキーマ定義の設計**
  - [x] `ScenarioCharacter`スキーマの設計（シナリオ内でのキャラクター情報）
  - [x] `ScenarioCharacterRelationship`スキーマの設計（シナリオ内での関係性）

### Phase 2: バックエンド実装 ✅

#### 2-1. スキーマ実装（packages/schema/src/） ✅

- [x] **2-1-1. scenarioCharacter.ts作成**
  - [x] `ScenarioCharacterSchema`定義（scenarioId, characterId, role等）
  - [x] `ScenarioCharacterFormDataSchema`定義
  - [x] `parseToScenarioCharacter`関数実装
  - [x] `parseToScenarioCharacterList`関数実装

- [x] **2-1-2. scenarioCharacterRelationship.ts作成**
  - [x] `ScenarioCharacterRelationshipSchema`定義
  - [x] `ScenarioCharacterRelationshipFormDataSchema`定義
  - [x] `parseToScenarioCharacterRelationship`関数実装
  - [x] `parseToScenarioCharacterRelationshipList`関数実装

- [x] **2-1-3. index.ts更新**
  - [x] 新しいスキーマのエクスポート追加

#### 2-2. グラフDBスキーマ更新（packages/graphdb/） ✅

- [x] **2-2-1. schemas.ts更新**
  - [x] `APPEARS_IN`エッジテーブル定義（Character → Scenario、role付き）
  - [x] `RELATES_IN_SCENARIO`エッジテーブル定義（Character → Character、scenarioId + relationshipName付き）

#### 2-3. リポジトリ実装（packages/graphdb/src/queries/） ✅

- [x] **2-3-1. scenarioCharacterRepository.ts作成**
  - [x] `addCharacterToScenario()`: キャラクターをシナリオに追加
  - [x] `removeCharacterFromScenario()`: シナリオからキャラクター削除
  - [x] `updateCharacterRole()`: シナリオ内での役割更新
  - [x] `findCharactersByScenarioId()`: シナリオに登場するキャラクター一覧取得

- [x] **2-3-2. scenarioCharacterRelationshipRepository.ts作成**
  - [x] `create()`: シナリオ内関係性作成
  - [x] `update()`: 関係性更新
  - [x] `delete()`: 関係性削除
  - [x] `findByScenarioId()`: シナリオ内の全関係性取得
  - [x] `findByScenarioAndCharacterId()`: 特定キャラクターの関係性取得

- [x] **2-3-3. index.ts更新**
  - [x] 新しいリポジトリのエクスポート追加

#### 2-4. テスト実装 ✅

- [x] **2-4-1. scenarioCharacterRepository.test.ts作成**
  - [x] キャラクター追加/削除テスト
  - [x] 役割更新テスト
  - [x] シナリオ別キャラクター取得テスト

- [x] **2-4-2. scenarioCharacterRelationshipRepository.test.ts作成**
  - [x] 関係性CRUD操作テスト
  - [x] シナリオ別関係性取得テスト
  - [x] キャラクター別関係性取得テスト

- [x] **2-4-3. テスト実行・全テスト通過確認**
  - [x] 統合テスト実行（9/9テスト通過）
  - [x] lint・型チェック実行

### Phase 3: フロントエンド実装 ✅

#### 3-1. Entity層実装（apps/frontend/src/entities/scenarioCharacter/） ✅

- [x] **3-1-1. Worker層**
  - [x] `scenarioCharacterGraphHandlers.ts`作成
  - [x] `scenarioCharacterRelationGraphHandlers.ts`作成
  - [x] `graphdb.worker.ts`にハンドラー登録

- [x] **3-1-2. API層**
  - [x] `scenarioCharacterGraphApi.ts`作成
  - [x] `scenarioCharacterRelationGraphApi.ts`作成

- [x] **3-1-3. Actions層**
  - [x] `scenarioCharacterActions.ts`作成
    - [x] `addCharacterToScenarioAction`
    - [x] `removeCharacterFromScenarioAction`
    - [x] `updateCharacterRoleAction`
    - [x] `readScenarioCharactersAction`
    - [x] `createScenarioCharacterRelationAction`
    - [x] `updateScenarioCharacterRelationAction`
    - [x] `deleteScenarioCharacterRelationAction`
    - [x] `readScenarioCharacterRelationsAction`

- [x] **3-1-4. Model層**
  - [x] `scenarioCharacterSlice.ts`作成
    - [x] State定義（シナリオ別キャラクター一覧、関係性一覧）
    - [x] セレクタ実装

- [x] **3-1-5. Hooks層**
  - [x] `useScenarioCharacterList.ts`作成
  - [x] `useScenarioCharacterRelationships.ts`作成

- [x] **3-1-6. index.ts作成**
  - [x] エンティティのエクスポート

#### 3-2. Store統合 ✅

- [x] **3-2-1. rootReducer.ts更新**
  - [x] `scenarioCharacterSlice`追加

- [x] **3-2-2. handlerMaps.ts更新**
  - [x] `ScenarioCharacterGraphHandlerMap`追加
  - [x] `ScenarioCharacterRelationGraphHandlerMap`追加

- [x] **3-2-3. 型チェック・lint実行**
  - [x] 型チェック通過
  - [x] lint通過

#### 3-3. UI層実装（packages/ui/src/）

- [ ] **3-3-1. scenarioCharacter/コンポーネント作成**
  - [ ] `ScenarioCharacterList.tsx`: シナリオに登録されたキャラクター一覧
  - [ ] `ScenarioCharacterAddModal.tsx`: キャラクター追加モーダル（既存キャラクターから選択）
  - [ ] `ScenarioCharacterRoleEdit.tsx`: 役割編集フォーム
  - [ ] `ScenarioCharacterRelationshipGraph.tsx`: シナリオ内関係性グラフ表示
  - [ ] `index.ts`: エクスポート

- [ ] **3-3-2. シナリオ編集画面への統合**
  - [ ] シナリオ詳細ページにキャラクター管理セクション追加
  - [ ] タブまたはアコーディオンでキャラクター一覧と関係性を表示

- [ ] **3-3-3. lint・型チェック実行**

### Phase 4: テスト・品質保証

- [x] **4-1. BDDテスト実装（apps/frontend/tests/）**
  - [x] `scenario-character.feature`作成
    - [x] シナリオ内でキャラクター新規作成シナリオ
    - [x] キャラクター役割更新シナリオ
    - [x] シナリオ内関係性作成シナリオ
    - [x] シナリオごとに異なる関係性管理シナリオ
    - [x] キャラクター削除シナリオ
  - [ ] `scenario-character.steps.ts`作成（フロントエンド実装後）
  - [ ] テスト実行・全シナリオ通過確認（フロントエンド実装後）

- [ ] **4-2. 証跡記録**
  - [ ] `docs/scenario-character-implementation.md`作成
    - [ ] 実装内容
    - [ ] アーキテクチャ
    - [ ] ファイル一覧
    - [ ] 技術的課題と解決策

## 完了基準

- [x] バックエンドテスト全通過（統合テスト、lint、型チェック）
- [x] フロントエンドEntity層実装完了（lint、型チェック通過）
- [ ] UI層実装（必要に応じて）
- [ ] BDDテスト全シナリオ通過（UI実装後）
- [ ] 証跡ドキュメント作成完了

## 実装進捗

### 完了した作業（YAGNI原則に従って最小実装）

#### Phase 1-2: バックエンド実装 ✅
- **GraphDBスキーマ**: `APPEARS_IN`, `RELATES_IN_SCENARIO` エッジ定義
- **TypeScriptスキーマ**: `scenarioCharacter.ts`, `scenarioCharacterRelationship.ts`
- **リポジトリ**: `scenarioCharacterRepository.ts`, `scenarioCharacterRelationshipRepository.ts`
- **テスト**: 9/9テスト全通過
- **品質保証**: lint・型チェック通過

#### Phase 3: フロントエンドEntity層実装 ✅
- **Worker層**: GraphDB操作ハンドラー（キャラクター関係、関係性）
- **API層**: GraphDBWorkerClient経由のAPI（キャラクター関係、関係性）
- **Actions層**: Redux非同期アクション（8種類のアクション）
- **Model層**: Redux Toolkit slice（シナリオ別state管理）
- **Hooks層**: React Hooks（`useScenarioCharacterList`, `useScenarioCharacterRelationships`）
- **Store統合**: rootReducer、handlerMaps更新
- **品質保証**: lint・型チェック通過

#### Phase 4: BDD Feature定義 ✅
- **Feature**: `scenario-character.feature` 作成完了
  - シナリオ内でキャラクター新規作成
  - キャラクター役割更新
  - シナリオ内関係性作成
  - シナリオごとに異なる関係性管理
  - キャラクター削除

### 次のステップ

UI層実装は必要に応じて後で追加可能。現時点でバックエンドとEntity層の基盤は完成。

## 技術スタック

- **スキーマ検証**: Valibot
- **グラフDB**: Kùzu WASM
- **状態管理**: Redux Toolkit
- **UI**: React + TypeScript
- **スタイリング**: Tailwind CSS
- **テスト**: Playwright（BDD）

## 参考資料

- [既存キャラクター関係管理実装](docs/character-relation-implementation.md)
- [シナリオスキーマ](packages/schema/src/scenario.ts)
- [キャラクタースキーマ](packages/schema/src/character.ts)
- [SceneEventsSectionコンポーネント](packages/ui/src/scene/form/SceneEventsSection.tsx)（UI実装参考）
