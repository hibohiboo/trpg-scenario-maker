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

### Phase 1: スキーマ設計

- [ ] **1-1. スキーマ定義の設計**
  - [ ] `ScenarioCharacter`スキーマの設計（シナリオ内でのキャラクター情報）
  - [ ] `ScenarioCharacterRelationship`スキーマの設計（シナリオ内での関係性）
  - [ ] データ構造のドキュメント作成

### Phase 2: バックエンド実装

#### 2-1. スキーマ実装（packages/schema/src/）

- [ ] **2-1-1. scenarioCharacter.ts作成**
  - [ ] `ScenarioCharacterSchema`定義（scenarioId, characterId, role等）
  - [ ] `ScenarioCharacterFormDataSchema`定義
  - [ ] `parseToScenarioCharacter`関数実装
  - [ ] `parseToScenarioCharacterList`関数実装

- [ ] **2-1-2. scenarioCharacterRelationship.ts作成**
  - [ ] `ScenarioCharacterRelationshipSchema`定義
  - [ ] `ScenarioCharacterRelationshipFormDataSchema`定義
  - [ ] `parseToScenarioCharacterRelationship`関数実装
  - [ ] `parseToScenarioCharacterRelationshipList`関数実装

- [ ] **2-1-3. index.ts更新**
  - [ ] 新しいスキーマのエクスポート追加

#### 2-2. グラフDBスキーマ更新（packages/graphdb/）

- [ ] **2-2-1. schemas.ts更新**
  - [ ] `APPEARS_IN`エッジテーブル定義（Scenario ← Character、role付き）
  - [ ] `RELATES_IN_SCENARIO`エッジテーブル定義（Character → Character、scenarioId + relationshipName付き）

#### 2-3. リポジトリ実装（packages/graphdb/src/queries/）

- [ ] **2-3-1. scenarioCharacterRepository.ts作成**
  - [ ] `addCharacterToScenario()`: キャラクターをシナリオに追加
  - [ ] `removeCharacterFromScenario()`: シナリオからキャラクター削除
  - [ ] `updateCharacterRole()`: シナリオ内での役割更新
  - [ ] `findCharactersByScenarioId()`: シナリオに登場するキャラクター一覧取得
  - [ ] `findScenariosByCharacterId()`: キャラクターが登場するシナリオ一覧取得

- [ ] **2-3-2. scenarioCharacterRelationshipRepository.ts作成**
  - [ ] `create()`: シナリオ内関係性作成
  - [ ] `update()`: 関係性更新
  - [ ] `delete()`: 関係性削除
  - [ ] `findByScenarioId()`: シナリオ内の全関係性取得
  - [ ] `findByScenarioAndCharacterId()`: 特定キャラクターの関係性取得

- [ ] **2-3-3. index.ts更新**
  - [ ] 新しいリポジトリのエクスポート追加

#### 2-4. テスト実装

- [ ] **2-4-1. scenarioCharacterRepository.test.ts作成**
  - [ ] キャラクター追加/削除テスト
  - [ ] 役割更新テスト
  - [ ] シナリオ別キャラクター取得テスト
  - [ ] キャラクター別シナリオ取得テスト

- [ ] **2-4-2. scenarioCharacterRelationshipRepository.test.ts作成**
  - [ ] 関係性CRUD操作テスト
  - [ ] シナリオ別関係性取得テスト
  - [ ] キャラクター別関係性取得テスト

- [ ] **2-4-3. テスト実行・全テスト通過確認**
  - [ ] 統合テスト実行
  - [ ] lint・型チェック実行

### Phase 3: フロントエンド実装

#### 3-1. Entity層実装（apps/frontend/src/entities/scenarioCharacter/）

- [ ] **3-1-1. Worker層**
  - [ ] `scenarioCharacterGraphHandlers.ts`作成
  - [ ] `scenarioCharacterRelationGraphHandlers.ts`作成
  - [ ] `graphdb.worker.ts`にハンドラー登録

- [ ] **3-1-2. API層**
  - [ ] `scenarioCharacterGraphApi.ts`作成
  - [ ] `scenarioCharacterRelationGraphApi.ts`作成

- [ ] **3-1-3. Actions層**
  - [ ] `scenarioCharacterActions.ts`作成
    - [ ] `addCharacterToScenarioAction`
    - [ ] `removeCharacterFromScenarioAction`
    - [ ] `updateCharacterRoleAction`
    - [ ] `readScenarioCharactersAction`

- [ ] **3-1-4. Model層**
  - [ ] `scenarioCharacterSlice.ts`作成
    - [ ] State定義（シナリオ別キャラクター一覧、選択中シナリオID等）
    - [ ] モーダル状態管理
    - [ ] セレクタ実装

- [ ] **3-1-5. Hooks層**
  - [ ] `useScenarioCharacterList.ts`作成
  - [ ] `useAddCharacterToScenario.ts`作成
  - [ ] `useScenarioCharacterRelationships.ts`作成

- [ ] **3-1-6. index.ts作成**
  - [ ] エンティティのエクスポート

#### 3-2. Store統合

- [ ] **3-2-1. rootReducer.ts更新**
  - [ ] `scenarioCharacterSlice`追加

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

- [ ] **4-1. BDDテスト実装（apps/frontend/tests/）**
  - [ ] `scenario-character.feature`作成
    - [ ] シナリオにキャラクター追加シナリオ
    - [ ] キャラクター削除シナリオ
    - [ ] 役割編集シナリオ
  - [ ] `scenario-character.steps.ts`作成
  - [ ] テスト実行・全シナリオ通過確認

- [ ] **4-2. 証跡記録**
  - [ ] `docs/scenario-character-implementation.md`作成
    - [ ] 実装内容
    - [ ] アーキテクチャ
    - [ ] ファイル一覧
    - [ ] 技術的課題と解決策

## 完了基準

- [ ] バックエンドテスト全通過（統合テスト、lint、型チェック）
- [ ] フロントエンドテスト全通過（lint、型チェック、ビルド）
- [ ] BDDテスト全シナリオ通過
- [ ] 証跡ドキュメント作成完了
- [ ] 依存関係・制約事項の明確化

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
