# フロントエンドリファクタリング タスクリスト

## 概要

scenarioDetailページの肥大化を解消し、Feature-Sliced Designの完全な階層構造に再編成する。

### 現状の問題点
- **GOD HOOK**: `useScenarioDetailPage.ts` (533行) が5つのドメインを1つで管理
- **プロップドリル**: `Page.tsx` が77個のpropsを子コンポーネントに渡している
- **feature/widget層の欠落**: page → entities の直接依存

### リファクタリング目標
- Page.tsx: 175行 → 約50行
- 最大hook: 533行 → 約80行/feature
- feature層: 0 → 5 features
- widget層: 0 → 3 widgets

---

## 依存関係ルール

```
page/
  ↓ 依存可能: widget, feature, entities

widget/
  ↓ 依存可能: feature, entities

feature/
  ↓ 依存可能: entities のみ

entities/
  ↓ 依存可能: shared, API

shared/
  ↓ 依存不可（最下層）
```

---

## フェーズ1: Feature層の作成

### タスク1-1: scenarioSceneManagement feature作成
- [ ] `apps/frontend/src/feature/scenarioSceneManagement/` ディレクトリ作成
- [ ] `hooks/useSceneManagement.ts` 作成
  - useSceneDetailPage から シーン関連ロジック（約100行）を抽出
  - scenes, connections, events の取得
  - フォーム開閉、作成・更新・削除ハンドラ
- [ ] `ui/SceneTabContent.tsx` 作成
  - 既存の `page/scenarioDetail/ui/SceneTabContent.tsx` (94行) を移動・修正
  - useSceneManagement を使用
- [ ] `index.ts` 作成（barrel export）

**抽出するロジック**:
```typescript
// useScenarioDetailPage から抽出
- scenes, isLoading, error
- connections
- events
- isFormOpen, editingScene
- handleCreateScene, handleUpdateScene, handleDeleteScene
- openForm, closeForm
```

### タスク1-2: scenarioCharacterManagement feature作成
- [ ] `apps/frontend/src/feature/scenarioCharacterManagement/` ディレクトリ作成
- [ ] `hooks/useCharacterManagement.ts` 作成
  - キャラクター一覧取得
  - 作成・更新・削除ハンドラ
  - モーダル制御
- [ ] `ui/CharacterTabContent.tsx` 作成
  - 既存の `page/scenarioDetail/ui/CharacterTabContent.tsx` から基本UI部分を抽出
  - 画像ギャラリー・関係性グラフは除外（widget層へ）
- [ ] `index.ts` 作成

**抽出するロジック**:
```typescript
- characters, isCharactersLoading
- isCreateModalOpen, isEditModalOpen
- selectedCharacter
- handleCreateCharacter, handleUpdateCharacter, handleDeleteCharacter
- openCreateModal, closeCreateModal
```

### タスク1-3: scenarioRelationshipManagement feature作成
- [ ] `apps/frontend/src/feature/scenarioRelationshipManagement/` ディレクトリ作成
- [ ] `hooks/useRelationshipManagement.ts` 作成
  - 関係性一覧取得
  - 作成・削除ハンドラ
- [ ] `ui/RelationshipSection.tsx` 作成
  - 関係性リスト表示
  - 作成・削除フォーム
- [ ] `index.ts` 作成

**抽出するロジック**:
```typescript
- characterRelations, isRelationsLoading
- isRelationshipModalOpen
- selectedRelationship
- handleCreateRelationship, handleDeleteRelationship
```

### タスク1-4: scenarioInformationManagement feature作成
- [ ] `apps/frontend/src/feature/scenarioInformationManagement/` ディレクトリ作成
- [ ] `hooks/useInformationManagement.ts` 作成
  - 情報項目一覧取得
  - 接続管理
  - フォーム制御
- [ ] `ui/InformationItemTabContent.tsx` 作成
  - 既存の `page/scenarioDetail/ui/InformationItemTabContent.tsx` (145行) を移動・修正
- [ ] `index.ts` 作成

**抽出するロジック**:
```typescript
- informationItems, isInformationLoading
- connections
- isFormOpen, editingItem
- isConnectionModalOpen
- handleCreateItem, handleUpdateItem, handleDeleteItem
- handleConnect, handleDisconnect
```

### タスク1-5: scenarioEventManagement feature作成
- [ ] `apps/frontend/src/feature/scenarioEventManagement/` ディレクトリ作成
- [ ] `hooks/useEventManagement.ts` 作成
  - イベント一覧取得
  - 作成・更新・削除ハンドラ
- [ ] `index.ts` 作成

**抽出するロジック**:
```typescript
- events, isEventsLoading
- handleCreateEvent, handleUpdateEvent, handleDeleteEvent
```

---

## フェーズ2: Widget層の作成

### タスク2-1: TabNavigationBar widget作成
- [ ] `apps/frontend/src/widget/TabNavigationBar/` ディレクトリ作成
- [ ] `ui/TabNavigationBar.tsx` 作成
  - タブアイテムの配列を受け取る
  - currentTab, onTabChange の制御コンポーネント
  - 再利用可能な汎用タブUI
- [ ] `types.ts` 作成（TabItem型定義）
- [ ] `index.ts` 作成

**インターフェース**:
```typescript
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface Props {
  items: TabItem[];
  currentTab: string;
  onTabChange: (tabId: string) => void;
}
```

### タスク2-2: CharacterManagementWidget widget作成
- [ ] `apps/frontend/src/widget/CharacterManagementWidget/` ディレクトリ作成
- [ ] `ui/CharacterManagementWidget.tsx` 作成
  - CharacterTabContent（feature）を使用
  - 画像ギャラリーセクションを追加
  - 関係性グラフセクションを追加
- [ ] `ui/ImageGallerySection.tsx` 作成
  - useCharacterImages を使用
  - 画像一覧表示
- [ ] `ui/RelationshipGraphSection.tsx` 作成
  - useRelationshipManagement を使用
  - グラフビジュアライゼーション（将来的にD3.js等を使用）
- [ ] `index.ts` 作成

### タスク2-3: SceneEditorWidget widget作成
- [ ] `apps/frontend/src/widget/SceneEditorWidget/` ディレクトリ作成
- [ ] `ui/SceneEditorWidget.tsx` 作成
  - SceneTabContent（feature）を使用
  - イベントリストセクションを追加
  - 接続グラフセクションを追加（将来的な拡張）
- [ ] `index.ts` 作成

---

## フェーズ3: Page層のリファクタリング

### タスク3-1: Page.tsx の簡素化
- [ ] `apps/frontend/src/page/scenarioDetail/ui/Page.tsx` を修正
  - useScenarioDetailPage の使用を削除
  - TabNavigationBar widget を使用
  - タブ状態管理（useState）のみ
  - 各タブに対応する widget/feature を配置
- [ ] 77個のpropsを削除（scenarioIdのみを各widget/featureに渡す）
- [ ] 目標: 175行 → 約50行

**修正後のコード構造**:
```typescript
export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [currentTab, setCurrentTab] = useState('scene');

  return (
    <div>
      <h1>シナリオ詳細</h1>
      <TabNavigationBar items={tabItems} currentTab={currentTab} onTabChange={setCurrentTab} />

      {currentTab === 'scene' && <SceneEditorWidget scenarioId={id} />}
      {currentTab === 'character' && <CharacterManagementWidget scenarioId={id} />}
      {currentTab === 'information' && <InformationItemTabContent scenarioId={id} />}
    </div>
  );
}
```

### タスク3-2: 既存ファイルの削除
- [ ] `apps/frontend/src/page/scenarioDetail/hooks/useScenarioDetailPage.ts` を削除
- [ ] `apps/frontend/src/page/scenarioDetail/ui/CharacterTabContent.tsx` を削除
- [ ] `apps/frontend/src/page/scenarioDetail/ui/InformationItemTabContent.tsx` を削除
- [ ] `apps/frontend/src/page/scenarioDetail/ui/SceneTabContent.tsx` を削除
- [ ] `apps/frontend/src/page/scenarioDetail/ui/Navigation.tsx` を削除（TabNavigationBarに置き換え）

---

## フェーズ4: テスト・検証

### タスク4-1: TypeScript型チェック
- [ ] `cd apps/frontend && bun run typecheck` 実行
- [ ] 型エラーがあれば修正

### タスク4-2: Lint実行
- [ ] `cd apps/frontend && bun run lint` 実行
- [ ] Lintエラーがあれば修正

### タスク4-3: ビルド確認
- [ ] `cd apps/frontend && bun run build` 実行
- [ ] ビルドエラーがあれば修正

### タスク4-4: BDDテスト実行
- [ ] 既存のBDDテスト実行
  - `bun test:e2e` または該当するコマンド
- [ ] `features/scenario-character.feature` が通過することを確認
- [ ] `features/character-relationship.feature` が通過することを確認
- [ ] `features/scenario-creation.feature` が通過することを確認
- [ ] `features/information-item.feature` が通過することを確認

### タスク4-5: 手動動作確認
- [ ] シナリオ詳細ページにアクセス
- [ ] シーンタブの動作確認（作成・編集・削除）
- [ ] キャラクタータブの動作確認（作成・編集・削除・画像・関係性）
- [ ] 情報項目タブの動作確認（作成・編集・削除・接続）

---

## フェーズ5: ドキュメント更新

### タスク5-1: CLAUDE.md 更新
- [ ] 新しいディレクトリ構造をドキュメントに反映
- [ ] feature層の説明追加
- [ ] widget層の説明追加
- [ ] 依存関係ルールの明記

### タスク5-2: README.md 更新（必要なら）
- [ ] apps/frontend/README.md にFSD構造の説明を追加

---

## 完了条件

- [ ] すべてのタスクが完了
- [ ] TypeScript型チェック通過
- [ ] Lint通過
- [ ] ビルド成功
- [ ] BDDテスト全通過
- [ ] 手動動作確認完了
- [ ] ドキュメント更新完了

---

## 注意事項

### 改行コード
- 全ファイルをLFで作成する（Windowsでも改行コードはLF）

### 段階的な実装
1. 各featureを1つずつ作成
2. widgetを作成
3. Page.tsxを最後に修正（これにより既存コードを壊さない）

### ロールバック計画
- ブランチ作成: `git checkout -b refactor/frontend-fsd`
- 問題があればすぐにロールバック可能

---

## 進捗状況

### フェーズ1: Feature層の作成
- [ ] タスク1-1: scenarioSceneManagement
- [ ] タスク1-2: scenarioCharacterManagement
- [ ] タスク1-3: scenarioRelationshipManagement
- [ ] タスク1-4: scenarioInformationManagement
- [ ] タスク1-5: scenarioEventManagement

### フェーズ2: Widget層の作成
- [ ] タスク2-1: TabNavigationBar
- [ ] タスク2-2: CharacterManagementWidget
- [ ] タスク2-3: SceneEditorWidget

### フェーズ3: Page層のリファクタリング
- [ ] タスク3-1: Page.tsx の簡素化
- [ ] タスク3-2: 既存ファイルの削除

### フェーズ4: テスト・検証
- [ ] タスク4-1: TypeScript型チェック
- [ ] タスク4-2: Lint実行
- [ ] タスク4-3: ビルド確認
- [ ] タスク4-4: BDDテスト実行
- [ ] タスク4-5: 手動動作確認

### フェーズ5: ドキュメント更新
- [ ] タスク5-1: CLAUDE.md 更新
- [ ] タスク5-2: README.md 更新

---

## 備考

### 推定作業時間
- フェーズ1: 約2-3時間（各feature 30-40分）
- フェーズ2: 約1-2時間（各widget 30-40分）
- フェーズ3: 約1時間
- フェーズ4: 約1時間
- フェーズ5: 約30分

**合計: 約5-7時間**

### リスク
- 既存のBDDテストが失敗する可能性（インポートパスの変更）
- propsの型不整合
- Redux状態管理の複雑さ

### 対策
- 段階的な実装（1つずつ確認）
- 各フェーズ後に型チェック実行
- 既存コードを削除する前にバックアップ
