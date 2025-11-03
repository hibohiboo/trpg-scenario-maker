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

### 2-1. InformationItemRepository作成（統合実装・DRY原則）
- [x] `packages/graphdb/src/queries/informationItemRepository.ts` 作成
  - [x] createInformationItem - 情報項目作成
  - [x] updateInformationItem - 情報項目更新
  - [x] deleteInformationItem - 情報項目削除
  - [x] getInformationItemsByScenarioId - シナリオの情報項目一覧取得
  - [x] createInformationConnection - 情報項目同士の関連作成
  - [x] deleteInformationConnection - 情報項目同士の関連削除
  - [x] getInformationConnectionsByScenarioId - 情報項目の関連一覧取得
  - [x] createSceneInformationConnection - シーン→情報項目の関連作成（SCENE_HAS_INFO）
  - [x] deleteSceneInformationConnection - シーン→情報項目の関連削除
  - [x] getSceneInformationConnectionsBySceneId - シーンで獲得できる情報一覧取得
  - [x] createInformationToSceneConnection - 情報項目→シーンの関連作成（INFO_POINTS_TO_SCENE）
  - [x] deleteInformationToSceneConnection - 情報項目→シーンの関連削除
  - [x] getInformationToSceneConnectionsByInformationItemId - 情報が指し示すシーン一覧取得

**備考:** YAGNI・DRY原則に従い、3つのRepositoryを1つに統合実装

### 2-2. ユニットテスト作成
- [x] `packages/graphdb/src/queries/informationItemRepository.test.ts` 作成
  - [x] 情報項目CRUD テスト
  - [x] 情報項目同士の関連 テスト
  - [x] シーン→情報項目の関連 テスト
  - [x] 情報項目→シーンの関連 テスト
  - [x] ヘルパーメソッド導入（DRY原則）
- [x] 全テスト実行・通過確認

---

## フェーズ3: Web Worker層実装

### 3-1. Worker Handlers作成
- [x] `apps/frontend/src/entities/informationItem/workers/informationItemGraphHandlers.ts` 作成
  - [x] getInformationItemsByScenarioId Handler
  - [x] createInformationItem Handler
  - [x] updateInformationItem Handler
  - [x] deleteInformationItem Handler
  - [x] getInformationConnectionsByScenarioId Handler
  - [x] createInformationConnection Handler（情報項目同士）
  - [x] deleteInformationConnection Handler（情報項目同士）
  - [x] getSceneInformationConnectionsBySceneId Handler
  - [x] createSceneInformationConnection Handler（シーン→情報）
  - [x] deleteSceneInformationConnection Handler（シーン→情報）
  - [x] getInformationToSceneConnectionsByInformationItemId Handler
  - [x] createInformationToSceneConnection Handler（情報→シーン）
  - [x] deleteInformationToSceneConnection Handler（情報→シーン）

### 3-2. Worker登録
- [x] `apps/frontend/src/workers/graphdb.worker.ts` 更新
  - [x] informationItemGraphHandlers をインポート
  - [x] ハンドラーマップに登録
- [x] `apps/frontend/src/workers/types/handlerMaps.ts` 更新
  - [x] InformationItemGraphHandlerMap を GlobalHandlerMap に追加

---

## フェーズ4: フロントエンド層実装（API・State管理）

### 4-1. InformationItem API作成
- [x] `apps/frontend/src/entities/informationItem/api/informationItemGraphApi.ts` 作成
  - [x] getInformationItemsByScenarioId API
  - [x] createInformationItem API
  - [x] updateInformationItem API
  - [x] deleteInformationItem API
  - [x] getInformationConnectionsByScenarioId API
  - [x] createInformationConnection API（情報項目同士）
  - [x] deleteInformationConnection API（情報項目同士）
  - [x] getSceneInformationConnectionsBySceneId API
  - [x] createSceneInformationConnection API（シーン→情報）
  - [x] deleteSceneInformationConnection API（シーン→情報）
  - [x] getInformationToSceneConnectionsByInformationItemId API
  - [x] createInformationToSceneConnection API（情報→シーン）
  - [x] deleteInformationToSceneConnection API（情報→シーン）
  - [x] save API（データ永続化）

### 4-2. Redux State管理
- [x] `apps/frontend/src/entities/informationItem/actions/informationItemActions.ts` 作成
  - [x] 13のAsync Thunkアクション実装
- [x] `apps/frontend/src/entities/informationItem/model/informationItemSlice.ts` 作成
  - [x] InformationItemState型定義
  - [x] 6つのReducers実装（フォーム制御、編集状態、クリア）
  - [x] 39のextraReducers実装（全アクションのpending/fulfilled/rejected）
- [x] `apps/frontend/src/app/store/rootReducer.ts` 更新
  - [x] informationItemSlice を Redux Store に登録
- [x] `packages/ui/src/informationItem/types.ts` 作成
  - [x] InformationItem, InformationItemConnection, etc. 型定義
- [x] `packages/ui/src/index.ts` 更新
  - [x] InformationItem型のエクスポート
- [x] `apps/frontend/src/entities/informationItem/index.ts` 作成
  - [x] Public API定義（Feature-Sliced Design準拠）
- [x] Lint・型チェック通過確認

### 4-3. Custom Hooks作成
- [x] `apps/frontend/src/entities/informationItem/hooks/useInformationItemEditor.ts` 作成
  - [x] 統合Hook（List + Operations）
  - [x] reload機能実装
- [x] `apps/frontend/src/entities/informationItem/hooks/useInformationItemList.ts` 作成
  - [x] 情報項目一覧取得Hook
- [x] `apps/frontend/src/entities/informationItem/hooks/useInformationItemOperations.ts` 作成
  - [x] 情報項目CRUD操作Hook
  - [x] 情報項目同士の関連操作Hook
  - [x] シーン-情報項目の関連操作Hook（双方向）
- [x] `apps/frontend/src/entities/informationItem/hooks/useInformationItemFormState.ts` 作成
  - [x] フォーム状態管理Hook
- [x] `apps/frontend/src/entities/informationItem/index.ts` 更新
  - [x] Hooks の Public API エクスポート
- [x] Lint・型チェック通過確認

---

## フェーズ5: UIコンポーネント実装

### 5-1. 情報項目管理コンポーネント
- [x] `packages/ui/src/informationItem/InformationItemList.tsx` 作成
  - [x] 情報項目一覧表示
  - [x] 情報項目選択機能
  - [x] 新規作成ボタン
  - [x] 削除ボタン
- [x] `packages/ui/src/informationItem/InformationItemForm.tsx` 作成
  - [x] 情報項目作成・編集フォーム
  - [x] タイトル・説明入力フィールド
  - [x] 送信・キャンセル・削除ボタン
- [x] `packages/ui/src/informationItem/InformationItemCard.tsx` 作成
  - [x] 情報項目カード表示
  - [x] 削除ボタン
- [x] `packages/ui/src/informationItem/index.ts` 作成
  - [x] コンポーネントエクスポート
- [x] `packages/ui/src/index.ts` 更新
  - [x] Public API エクスポート

### 5-2. 関連管理コンポーネント
- [ ] （YAGNI原則により後回し - 必要になった時点で実装）

### 5-3. Storybook作成
- [x] `packages/ui/src/informationItem/InformationItemList.stories.tsx`
  - [x] Default, Loading, Empty, SingleItem, NoDescription, ManyItems シナリオ
- [x] `packages/ui/src/informationItem/InformationItemForm.stories.tsx`
  - [x] CreateNew, Edit, EditWithoutCancel, EditWithoutDelete シナリオ
- [x] `packages/ui/src/informationItem/InformationItemCard.stories.tsx`
  - [x] Default, NoDescription, WithoutDelete, WithoutClick, LongDescription シナリオ
- [x] Lint・型チェック通過確認

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
