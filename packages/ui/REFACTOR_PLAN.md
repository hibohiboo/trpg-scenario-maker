# UIパッケージ リファクタリング計画

## 現状の問題点

### 1. フロントエンドとの階層の不一致
- **現状**: uiパッケージは `character/`, `scene/`, `scenario/` などのエンティティ別ディレクトリ
- **問題**: フロントエンドは Feature-Sliced Design (FSD) を採用しており、`feature/`, `widget/`, `entities/` の階層構造
- **影響**: どのUIコンポーネントがどの層で使われるべきか不明確

### 2. コンポーネントの責務が混在
- ページレベルのコンポーネント（`ScenarioPage`, `CharacterRelationshipPage`）
- Featureレベルのコンポーネント（`SceneEditor`, `ScenarioCharacterList`）
- Widgetレベルのコンポーネント（`CharacterRelationshipGraph`）
- 共通コンポーネント（`Button`, `Modal`）

が同じ階層で混在している

## リファクタリング方針

### 基本原則
**UIパッケージはフロントエンドの階層構造を反映する**

```
packages/ui/src/
├── shared/           # 汎用UIコンポーネント（全層で使用可能）
├── entities/         # エンティティ固有のUIコンポーネント
├── features/         # Feature固有のUIコンポーネント（複数entityを組み合わせ）
└── widgets/          # Widget固有のUIコンポーネント（複数featureを組み合わせ）
```

### 新しい構造

```
packages/ui/src/
├── shared/                           # 汎用UIコンポーネント
│   ├── button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── modal/
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── loading/
│   ├── error/
│   ├── layout/
│   ├── tabs/
│   └── index.ts
│
├── entities/                         # エンティティ固有のUIコンポーネント
│   ├── character/
│   │   ├── CharacterList.tsx        # 基本的なキャラクターリスト
│   │   ├── CharacterCard.tsx
│   │   ├── CharacterForm.tsx
│   │   └── index.ts
│   ├── scene/
│   │   ├── SceneCard.tsx
│   │   ├── SceneForm.tsx
│   │   ├── SceneNode.tsx            # React Flow用ノード
│   │   └── index.ts
│   ├── scenario/
│   │   ├── ScenarioCard.tsx
│   │   ├── ScenarioForm.tsx
│   │   ├── ScenarioList.tsx
│   │   └── index.ts
│   ├── informationItem/
│   │   ├── InformationItemCard.tsx
│   │   ├── InformationItemForm.tsx
│   │   ├── InformationItemList.tsx
│   │   └── index.ts
│   ├── image/
│   │   ├── ImageInput.tsx
│   │   └── index.ts
│   └── index.ts
│
├── features/                         # Feature固有のUIコンポーネント
│   ├── scenarioSceneManagement/
│   │   ├── SceneEditor.tsx          # シーン編集（Scene + SceneEvent + Connection）
│   │   ├── SceneFlowCanvas.tsx      # React Flowキャンバス
│   │   ├── SceneConnectionSection.tsx
│   │   ├── SceneEventsSection.tsx
│   │   └── index.ts
│   ├── scenarioCharacterManagement/
│   │   ├── ScenarioCharacterList.tsx         # キャラクター管理リスト
│   │   ├── ScenarioCharacterFormModal.tsx
│   │   ├── ScenarioCharacterEditModal.tsx
│   │   ├── CharacterImageGallery.tsx         # 画像ギャラリー（Character + Image）
│   │   └── index.ts
│   ├── scenarioRelationshipManagement/
│   │   ├── ScenarioCharacterRelationshipList.tsx
│   │   ├── ScenarioCharacterRelationshipFormModal.tsx
│   │   └── index.ts
│   ├── scenarioInformationManagement/
│   │   ├── InformationItemConnectionList.tsx
│   │   ├── InformationItemConnectionFormModal.tsx
│   │   └── index.ts
│   └── index.ts
│
├── widgets/                          # Widget固有のUIコンポーネント
│   ├── characterRelationshipGraph/
│   │   ├── CharacterRelationshipGraph.tsx   # グラフビジュアライゼーション
│   │   ├── CharacterNode.tsx
│   │   └── index.ts
│   └── index.ts
│
├── styles/                           # グローバルスタイル
└── index.ts                          # メインエクスポート
```

## 移行マッピング

### Shared層（汎用UIコンポーネント）
| 現在のパス | 移行先 |
|-----------|--------|
| `common/Button.tsx` | `shared/button/Button.tsx` |
| `common/Modal.tsx` | `shared/modal/Modal.tsx` |
| `common/Loading.tsx` | `shared/loading/Loading.tsx` |
| `common/ErrorMessage.tsx` | `shared/error/ErrorMessage.tsx` |
| `common/Layout.tsx` | `shared/layout/Layout.tsx` |
| `common/Tabs.tsx` | `shared/tabs/Tabs.tsx` |
| `common/Navigation.tsx` | `shared/navigation/Navigation.tsx` |

### Entities層（エンティティ固有のUI）
| 現在のパス | 移行先 |
|-----------|--------|
| `character/CharacterList.tsx` | `entities/character/CharacterList.tsx` |
| `character/CharacterCreateModal.tsx` | `entities/character/CharacterForm.tsx` |
| `character/RelationshipList.tsx` | `entities/character/RelationshipList.tsx` |
| `character/RelationshipForm.tsx` | `entities/character/RelationshipForm.tsx` |
| `character/DeleteRelationshipModal.tsx` | `entities/character/DeleteRelationshipModal.tsx` |
| `scene/SceneForm.tsx` | `entities/scene/SceneForm.tsx` |
| `scene/canvas/SceneNode.tsx` | `entities/scene/SceneNode.tsx` |
| `scene/canvas/InformationItemNode.tsx` | `entities/scene/InformationItemNode.tsx` |
| `scenario/ScenarioCard.tsx` | `entities/scenario/ScenarioCard.tsx` |
| `scenario/ScenarioForm.tsx` | `entities/scenario/ScenarioForm.tsx` |
| `scenario/ScenarioList.tsx` | `entities/scenario/ScenarioList.tsx` |
| `scenario/DeleteConfirmModal.tsx` | `entities/scenario/DeleteConfirmModal.tsx` |
| `image/ImageInput.tsx` | `entities/image/ImageInput.tsx` |

### Features層（複数entityを組み合わせたUI）
| 現在のパス | 移行先 |
|-----------|--------|
| `scene/SceneEditor.tsx` | `features/scenarioSceneManagement/SceneEditor.tsx` |
| `scene/SceneFlowCanvas.tsx` | `features/scenarioSceneManagement/SceneFlowCanvas.tsx` |
| `scene/form/SceneConnectionSection.tsx` | `features/scenarioSceneManagement/SceneConnectionSection.tsx` |
| `scene/form/SceneEventsSection.tsx` | `features/scenarioSceneManagement/SceneEventsSection.tsx` |
| `scene/form/SceneBasicFields.tsx` | `features/scenarioSceneManagement/SceneBasicFields.tsx` |
| `scene/form/SceneInformationSection.tsx` | `features/scenarioSceneManagement/SceneInformationSection.tsx` |
| `scene/canvas/FlowCanvas.tsx` | `features/scenarioSceneManagement/FlowCanvas.tsx` |
| `scene/canvas/CanvasToolbar.tsx` | `features/scenarioSceneManagement/CanvasToolbar.tsx` |
| `scene/canvas/SceneDetailSidebar.tsx` | `features/scenarioSceneManagement/SceneDetailSidebar.tsx` |
| `scene/sceneEvent/SceneEventForm.tsx` | `features/scenarioSceneManagement/SceneEventForm.tsx` |
| `scene/sceneEvent/SceneEventIcon.tsx` | `features/scenarioSceneManagement/SceneEventIcon.tsx` |
| `scenarioCharacter/ScenarioCharacterList.tsx` | `features/scenarioCharacterManagement/ScenarioCharacterList.tsx` |
| `scenarioCharacter/ScenarioCharacterFormModal.tsx` | `features/scenarioCharacterManagement/ScenarioCharacterFormModal.tsx` |
| `scenarioCharacter/ScenarioCharacterEditModal.tsx` | `features/scenarioCharacterManagement/ScenarioCharacterEditModal.tsx` |
| `scenarioCharacter/CharacterDetailPanel.tsx` | `features/scenarioCharacterManagement/CharacterDetailPanel.tsx` |
| `image/CharacterImageGallery.tsx` | `features/scenarioCharacterManagement/CharacterImageGallery.tsx` |
| `image/CharacterImageUploadModal.tsx` | `features/scenarioCharacterManagement/CharacterImageUploadModal.tsx` |
| `scenarioCharacter/ScenarioCharacterRelationshipList.tsx` | `features/scenarioRelationshipManagement/ScenarioCharacterRelationshipList.tsx` |
| `scenarioCharacter/ScenarioCharacterRelationshipFormModal.tsx` | `features/scenarioRelationshipManagement/ScenarioCharacterRelationshipFormModal.tsx` |
| `informationItem/InformationItemCard.tsx` | `features/scenarioInformationManagement/InformationItemCard.tsx` |
| `informationItem/InformationItemForm.tsx` | `features/scenarioInformationManagement/InformationItemForm.tsx` |
| `informationItem/InformationItemList.tsx` | `features/scenarioInformationManagement/InformationItemList.tsx` |
| `informationItem/InformationItemConnectionList.tsx` | `features/scenarioInformationManagement/InformationItemConnectionList.tsx` |
| `informationItem/InformationItemConnectionFormModal.tsx` | `features/scenarioInformationManagement/InformationItemConnectionFormModal.tsx` |

**Note**: InformationItem関連コンポーネントは、シーンとの結合があるため一旦Feature層に配置。後でCRUD部分を切り出してEntity層に移動するリファクタリングを検討。

### Widgets層（複雑なビジュアライゼーション）
| 現在のパス | 移行先 |
|-----------|--------|
| `scenarioCharacter/CharacterRelationshipGraph.tsx` | `widgets/characterRelationshipGraph/CharacterRelationshipGraph.tsx` |
| `scenarioCharacter/CharacterNode.tsx` | `widgets/characterRelationshipGraph/CharacterNode.tsx` |
| `scenarioCharacter/CharacterGraphToolbar.tsx` | `widgets/characterRelationshipGraph/CharacterGraphToolbar.tsx` |

### 削除するファイル（ページレベルコンポーネント）
| ファイル | 理由 |
|---------|------|
| `scenario/ScenarioPage.tsx` | フロントエンドのpage層で実装すべき |
| `character/CharacterRelationshipPage.tsx` | フロントエンドのpage層で実装すべき |

## 実装手順

### フェーズ1: 新しいディレクトリ構造の作成
- [ ] `shared/` ディレクトリ作成
- [ ] `entities/` ディレクトリ作成（各entity別サブディレクトリ）
- [ ] `features/` ディレクトリ作成（各feature別サブディレクトリ）
- [ ] `widgets/` ディレクトリ作成

### フェーズ2: ファイル移動
- [ ] Shared層のコンポーネントを移動
- [ ] Entities層のコンポーネントを移動
- [ ] Features層のコンポーネントを移動
- [ ] Widgets層のコンポーネントを移動

### フェーズ3: インポートパスの修正
- [ ] 各コンポーネント内のインポートパスを修正
- [ ] `index.ts` のエクスポートを修正
- [ ] Storybookの設定を更新

### フェーズ4: フロントエンドのインポートパス修正
- [ ] `apps/frontend/src/` 内の全てのインポートパスを更新

### フェーズ5: テスト・検証
- [ ] Storybook起動確認
- [ ] フロントエンドのビルド確認
- [ ] 型チェック実行

## メリット

### 1. 一貫性
- フロントエンドとUIパッケージの階層構造が一致
- どのコンポーネントがどの層で使われるか明確

### 2. 保守性
- コンポーネントの責務が明確
- 変更の影響範囲が予測しやすい

### 3. 再利用性
- 層別にコンポーネントが整理され、適切な粒度で再利用可能
- Shared層のコンポーネントは全層で使用可能

### 4. スケーラビリティ
- 新しいfeatureやwidgetの追加が容易
- 各層が独立しており、並行開発がしやすい

## 注意事項

### 破壊的変更
このリファクタリングは**破壊的変更**です。フロントエンド側のインポートパスをすべて更新する必要があります。

### 段階的な実装
一度にすべて移行するのではなく、段階的に移行することを推奨：
1. 新しい構造を作成
2. 古い構造と並行稼働（deprecatedマーク）
3. フロントエンドのインポートパスを段階的に更新
4. 古い構造を削除

### Storybookの対応
Storybookのストーリーファイルも移動する必要があります。
