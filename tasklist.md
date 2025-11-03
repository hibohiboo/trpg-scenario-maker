# 情報項目機能追加タスクリスト

## 概要
シナリオ編集に情報項目（Information Item）を扱える機能を追加する。
情報項目同士の関連、情報項目とシーンの関連を管理し、シーングラフで両方のつながりを確認可能にする。

**関係の種類:**
1. **情報項目同士の関連**: InformationItem ⇔ InformationItem
2. **シーンで獲得できる情報**: Scene → InformationItem（SCENE_HAS_INFO）
3. **情報が指し示すシーン**: InformationItem → Scene（INFO_POINTS_TO_SCENE）
   - 「この情報を獲得すると、このシーンに行ける」という関係

---

## フェーズ1: データモデル設計・スキーマ定義

### 1-1. Valibotスキーマ定義
- [x] `packages/schema/src/informationItem.ts` 作成
  - [x] InformationItem スキーマ定義
  - [x] InformationItemConnection スキーマ定義（情報項目同士の関連）
  - [x] SceneInformationConnection スキーマ定義（シーンで獲得できる情報）
  - [x] InformationToSceneConnection スキーマ定義（情報が指し示すシーン）
  - [x] パース関数の実装
  - [x] バリデーション関数の実装

### 1-2. GraphDBスキーマ定義
- [x] `packages/graphdb/src/schemas.ts` 更新
  - [x] InformationItem ノードの定義
  - [x] HAS_INFORMATION リレーション定義（Scenario → InformationItem）
  - [x] INFORMATION_RELATED_TO リレーション定義（InformationItem → InformationItem）
  - [x] SCENE_HAS_INFO リレーション定義（Scene → InformationItem：シーンで獲得できる情報）
  - [x] INFO_POINTS_TO_SCENE リレーション定義（InformationItem → Scene：情報が指し示すシーン）
  - [x] スキーマ作成Cypherクエリの追加

---

## フェーズ2: バックエンド層実装（GraphDB Repository）

### 2-1. InformationItemRepository作成
- [ ] `packages/graphdb/src/queries/informationItemRepository.ts` 作成
  - createInformationItem - 情報項目作成
  - updateInformationItem - 情報項目更新
  - deleteInformationItem - 情報項目削除
  - getInformationItemsByScenario - シナリオの情報項目一覧取得
  - getInformationItemById - 情報項目詳細取得

### 2-2. InformationItemConnectionRepository作成
- [ ] `packages/graphdb/src/queries/informationItemConnectionRepository.ts` 作成
  - createInformationConnection - 情報項目同士の関連作成
  - deleteInformationConnection - 情報項目同士の関連削除
  - getInformationConnections - 情報項目の関連一覧取得

### 2-3. SceneInformationConnectionRepository作成
- [ ] `packages/graphdb/src/queries/sceneInformationConnectionRepository.ts` 作成
  - createSceneInformationConnection - シーン→情報項目の関連作成（SCENE_HAS_INFO）
  - deleteSceneInformationConnection - シーン→情報項目の関連削除
  - getSceneInformationConnections - シーンで獲得できる情報一覧取得
  - createInformationToSceneConnection - 情報項目→シーンの関連作成（INFO_POINTS_TO_SCENE）
  - deleteInformationToSceneConnection - 情報項目→シーンの関連削除
  - getInformationToSceneConnections - 情報が指し示すシーン一覧取得

### 2-4. ユニットテスト作成
- [ ] `packages/graphdb/tests/informationItemRepository.test.ts` 作成
- [ ] `packages/graphdb/tests/informationItemConnectionRepository.test.ts` 作成
- [ ] `packages/graphdb/tests/sceneInformationConnectionRepository.test.ts` 作成
- [ ] 全テスト実行・通過確認

---

## フェーズ3: Web Worker層実装

### 3-1. Worker Handlers作成
- [ ] `apps/frontend/src/entities/informationItem/workers/informationItemHandlers.ts` 作成
  - createInformationItemHandler
  - updateInformationItemHandler
  - deleteInformationItemHandler
  - getInformationItemsHandler
  - createInformationConnectionHandler（情報項目同士）
  - deleteInformationConnectionHandler（情報項目同士）
  - createSceneInformationConnectionHandler（シーン→情報）
  - deleteSceneInformationConnectionHandler（シーン→情報）
  - createInformationToSceneConnectionHandler（情報→シーン）
  - deleteInformationToSceneConnectionHandler（情報→シーン）

### 3-2. Worker登録
- [ ] `apps/frontend/src/workers/graphdb.worker.ts` 更新
  - informationItemHandlers をインポート
  - ハンドラーマップに登録

---

## フェーズ4: フロントエンド層実装（API・State管理）

### 4-1. InformationItem API作成
- [ ] `apps/frontend/src/entities/informationItem/api/informationItemApi.ts` 作成
  - createInformationItem API
  - updateInformationItem API
  - deleteInformationItem API
  - getInformationItemsByScenario API
  - createInformationConnection API（情報項目同士）
  - deleteInformationConnection API（情報項目同士）
  - createSceneInformationConnection API（シーン→情報）
  - deleteSceneInformationConnection API（シーン→情報）
  - createInformationToSceneConnection API（情報→シーン）
  - deleteInformationToSceneConnection API（情報→シーン）

### 4-2. Redux State管理
- [ ] `apps/frontend/src/entities/informationItem/model/informationItemSlice.ts` 作成
  - State型定義
  - Reducers実装
  - Thunks実装（非同期アクション）
  - Selectors実装

### 4-3. Custom Hooks作成
- [ ] `apps/frontend/src/entities/informationItem/hooks/useInformationItemEditor.ts` 作成
  - 情報項目作成・編集・削除Hook
- [ ] `apps/frontend/src/entities/informationItem/hooks/useInformationItemConnections.ts` 作成
  - 情報項目同士の関連操作Hook
- [ ] `apps/frontend/src/entities/informationItem/hooks/useSceneInformationConnections.ts` 作成
  - シーン-情報項目の関連操作Hook

---

## フェーズ5: UIコンポーネント実装

### 5-1. 情報項目管理コンポーネント
- [ ] `packages/ui/src/informationItem/InformationItemList.tsx` 作成
  - 情報項目一覧表示
  - 情報項目選択機能
- [ ] `packages/ui/src/informationItem/InformationItemForm.tsx` 作成
  - 情報項目作成・編集フォーム
  - バリデーション実装
- [ ] `packages/ui/src/informationItem/InformationItemCard.tsx` 作成
  - 情報項目カード表示
  - 削除ボタン

### 5-2. 関連管理コンポーネント
- [ ] `packages/ui/src/informationItem/InformationConnectionForm.tsx` 作成
  - 情報項目同士の関連作成フォーム
- [ ] `packages/ui/src/informationItem/SceneInformationConnectionForm.tsx` 作成
  - シーン-情報項目の関連作成フォーム

### 5-3. Storybook作成
- [ ] `packages/ui/src/informationItem/InformationItemList.stories.tsx`
- [ ] `packages/ui/src/informationItem/InformationItemForm.stories.tsx`
- [ ] `packages/ui/src/informationItem/InformationItemCard.stories.tsx`
- [ ] Storybook動作確認

---

## フェーズ6: シーングラフ統合

### 6-1. React Flowノード拡張
- [ ] `packages/ui/src/scene/canvas/InformationItemNode.tsx` 作成
  - 情報項目ノードコンポーネント
  - スタイリング（シーンと区別できる色・形状）

### 6-2. FlowCanvas更新
- [ ] `packages/ui/src/scene/canvas/FlowCanvas.tsx` 更新
  - 情報項目ノードの表示対応
  - 情報項目エッジの表示対応
  - ノードタイプ判定ロジック追加

### 6-3. グラフデータ統合
- [ ] `apps/frontend/src/entities/scene/api/sceneGraphApi.ts` 更新
  - getSceneGraphWithInformation 実装
  - 情報項目を含むグラフデータ取得
- [ ] `packages/graphdb/src/queries/sceneRepository.ts` 更新
  - シーン + 情報項目の統合クエリ実装

---

## フェーズ7: ページ統合

### 7-1. シナリオ編集ページ更新
- [ ] `apps/frontend/src/entities/scenario/containers/Page.tsx` 更新
  - 情報項目タブの追加
  - 情報項目一覧の表示
- [ ] `packages/ui/src/scenario/ScenarioPage.tsx` 更新
  - レイアウト調整（情報項目セクション追加）

### 7-2. ルーティング
- [ ] `apps/frontend/src/app/router.tsx` 確認
  - 情報項目ページのルート追加（必要な場合）

---

## フェーズ8: E2E（BDD）テスト作成

### 8-1. Featureファイル作成
- [ ] `apps/frontend/tests/features/information-item.feature` 作成
  ```gherkin
  Feature: 情報項目管理
    Scenario: 情報項目を登録する
    Scenario: 情報項目同士の関連を登録する
    Scenario: 情報項目とシーンの関連を登録する
    Scenario: シーングラフで両方のつながりを確認する
  ```

### 8-2. Step実装
- [ ] `apps/frontend/tests/steps/information-item.steps.ts` 作成
  - Given/When/Then ステップ実装
  - ページオブジェクト実装

### 8-3. BDDテスト実行
- [ ] `bun run test:e2e` 実行（apps/frontend）
- [ ] 全シナリオ通過確認

---

## フェーズ9: 統合テスト・品質保証

### 9-1. Lint・型チェック
- [ ] `bun run lint` 実行（全プロジェクト）
- [ ] TypeScript型エラー修正

### 9-2. ユニットテスト実行
- [ ] `bun test` 実行（全パッケージ）
- [ ] 全テスト通過確認

### 9-3. ビルド確認
- [ ] `bun run build` 実行
- [ ] ビルドエラー修正

### 9-4. 手動動作確認
- [ ] 開発サーバー起動（`bun run dev`）
- [ ] 情報項目登録動作確認
- [ ] 情報項目同士の関連作成確認
- [ ] シーン-情報項目の関連作成確認
- [ ] シーングラフ表示確認（両方のつながり）

---

## フェーズ10: ドキュメント・完了

### 10-1. ドキュメント更新
- [ ] `readme.md` 更新
  - 情報項目機能の説明追加
  - スクリーンショット追加（任意）
- [ ] `apps/frontend/README.md` 更新（必要な場合）

### 10-2. 証跡記録
- [ ] 設計判断の記録
- [ ] 依存関係・制約事項の明確化
- [ ] 完了基準の確認

### 10-3. コミット・PR作成
- [ ] 変更をコミット
- [ ] PR作成・レビュー依頼

---

## 依存関係メモ

- **GraphDBスキーマ** → Repository実装
- **Repository実装** → Worker Handlers
- **Worker Handlers** → Frontend API
- **Frontend API** → Redux State
- **Redux State** → Custom Hooks
- **Custom Hooks** → UI Components
- **UI Components** → Page統合
- **Page統合** → BDDテスト

---

## 完了基準

1. ✅ GraphDBに情報項目ノード・リレーションが定義されている
2. ✅ 情報項目のCRUD操作が可能
3. ✅ 情報項目同士の関連が作成・削除可能
4. ✅ シーン-情報項目の関連が作成・削除可能
5. ✅ シーングラフで情報項目とその関連が表示される
6. ✅ BDDテストが全て通過する
7. ✅ Lint・型チェック・ビルドが成功する
8. ✅ ドキュメントが更新されている

---

## 備考

- 改行コードは全てLFで統一
- Valibotスキーマを境界で必ずパース（`as`型アサーション禁止）
- Web Worker内でのDB操作はすべて非同期
- UI実装はTailwind CSSでスタイリング
- React Flowノードは既存のSceneNodeを参考に実装
