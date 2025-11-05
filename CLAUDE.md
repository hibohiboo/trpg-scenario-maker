# TRPG Scenario Maker - プロジェクト情報

## プロジェクト構造

### モノレポ構成
- `apps/frontend` - フロントエンドアプリケーション（React + Redux）
- `apps/backend` - バックエンドアプリケーション
- `packages/ui` - 共通UIコンポーネント
- `packages/graphdb` - Neo4j GraphDB操作（KùzuDB使用）
- `packages/rdb` - PostgreSQL操作（Drizzle ORM使用）
- `packages/schema` - 共通型定義（Valibot）
- `packages/utility` - ユーティリティ関数

### データベース構成
- **GraphDB (Neo4j/KùzuDB)**: キャラクター、シーン、関係性などのグラフ構造データ
- **RDB (PostgreSQL)**: シナリオメタデータ、画像データなど

---

## 既存機能の実装パターン

### 1. キャラクター機能の実装構造

#### データ層
- **GraphDB スキーマ**: `packages/graphdb/src/schemas.ts`
  - Character ノード: `id`, `name`, `description`
  - リレーション: `APPEARS_IN`, `CHARACTER_RELATES_FROM/TO`, `RELATES_IN_SCENARIO`

- **RDB スキーマ**: `packages/rdb/src/schema.ts`
  - 現状: `scenarios` テーブルのみ
  - マイグレーション: `packages/rdb/migrations/0000_dashing_iron_fist.sql`

#### バックエンド層
- **Repository**: `packages/graphdb/src/queries/characterRepository.ts`
  - CRUD操作: `create()`, `update()`, `delete()`, `findAll()`, `findById()`
  - パラメータ: `id`, `name`, `description`

#### フロントエンド層（Feature-Sliced Design）
```
apps/frontend/src/entities/character/
├── api/
│   └── characterGraphApi.ts      # GraphDB通信
├── hooks/
│   ├── useCreateCharacter.ts     # 作成フック
│   ├── useCharacterList.ts       # 一覧取得フック
│   └── useUpdateCharacter.ts     # 更新フック
├── model/
│   └── characterSlice.ts         # Redux状態管理
└── actions/
    └── characterActions.ts       # Redux actions
```

#### UI層
```
packages/ui/src/character/
├── CharacterList.tsx             # 一覧表示
├── CharacterCreateModal.tsx      # 作成モーダル
├── RelationshipForm.tsx          # 関係性フォーム
├── DeleteRelationshipModal.tsx   # 削除確認
├── types.ts                      # 型定義
└── index.ts
```

#### 型定義
- **スキーマ**: `packages/schema/src/character.ts`
  ```typescript
  export const CharacterSchema = v.object({
    id: v.string(),
    name: v.string(),
    description: DescriptionSchema,
  });
  ```

- **UI型**: `packages/ui/src/character/types.ts`
  ```typescript
  interface Character {
    id: string;
    name: string;
    description: string;
  }
  ```

---

## テスト構造

### 1. BDD テスト（E2E）
- **場所**: `apps/frontend/tests/`
- **フレームワーク**: Cucumber + Playwright

#### 既存Featureファイル
- `features/scenario-character.feature` - シナリオ×キャラクター管理
- `features/character-relationship.feature` - キャラクター関係性
- `features/scenario-creation.feature` - シナリオ作成
- `features/information-item.feature` - 情報項目

#### ステップ定義
- `steps/scenario-character.steps.ts` - 登場キャラクター管理
  - モーダル操作、CRUD操作、削除確認ダイアログ処理

### 2. ユニットテスト
```
packages/graphdb/src/queries/
├── characterRepository.test.ts
├── sceneRepository.test.ts
├── scenarioCharacterRepository.test.ts
└── informationItemRepository.test.ts

packages/rdb/src/queries/
└── scenarioRepository.test.ts
```

### 3. フロントエンドテスト
- コンポーネントテスト: `packages/ui/src/**/*.test.tsx`
- Storybook: `**/*.stories.tsx`

---

## 既存の画像関連実装

### ImageInput コンポーネント
- **場所**: `packages/ui/src/image/ImageInput.tsx`
- **機能**:
  - ドラッグ&ドロップ対応
  - ファイル選択（input type="file"）
  - Data URL変換（base64エンコード）
  - プレビュー表示（300px幅）
  - エラーハンドリング
  - Data URLコピー機能
  - 画像ダウンロード機能

```typescript
export default function ImageUploadDataUrlPreview({
  viewDataUrl = false,  // Data URL表示切り替え
  onChangeDataUrl,      // コールバック: (url: string) => void
})
```

### 画像ユーティリティ
- **場所**: `packages/utility/src/image.ts`
```typescript
export const dataUrlToBlob = (dataUrl: string): Blob
```

---

## キャラクター画像機能の実装方針（2025-11-05調査）

### 要件
1. キャラクターに画像を設定可能にする
2. 画像はUUIDをキーにData URLをRDBに保存
3. GraphDBは画像IDを持つノードと`HAS_IMAGE`リレーションを持つ
4. 表示時はRDBから画像を取得して表示

### 実装が必要な箇所

#### A. スキーマ層
- [ ] `packages/schema/src/character.ts` - `imageUrl`フィールド追加
- [ ] `packages/schema/src/scenarioCharacter.ts` - `imageUrl`フィールド追加

#### B. データベース層
- [ ] RDB Migration作成 - `characters`テーブル作成（id, name, description, image_url）
- [ ] RDB Migration作成 - `scenario_characters`テーブル作成
- [ ] GraphDB Schema更新 - Characterノードに`imageUrl`プロパティ追加

#### C. バックエンド層
- [ ] `packages/graphdb/src/queries/characterRepository.ts` - CRUD操作に`imageUrl`パラメータ追加

#### D. フロントエンド API層
- [ ] `apps/frontend/src/entities/character/api/characterGraphApi.ts` - `imageUrl`パラメータ追加
- [ ] `apps/frontend/src/entities/character/model/characterSlice.ts` - 画像URL状態管理追加
- [ ] `apps/frontend/src/entities/character/hooks/useCreateCharacter.ts` - `imageUrl`フック追加

#### E. UI層
- [ ] `packages/ui/src/character/CharacterCreateModal.tsx` - ImageInput統合
- [ ] `packages/ui/src/character/CharacterList.tsx` - 画像表示追加
- [ ] `packages/ui/src/scenarioCharacter/` - シナリオキャラクター画像対応

#### F. テスト層
- [ ] BDD Feature作成 - `character-image.feature`
- [ ] BDD Steps作成 - `character-image.steps.ts`
- [ ] Unit Test更新 - `characterRepository.test.ts`

### データフロー
```
UI (ImageInput)
  ↓ onChangeDataUrl(dataUrl)
Redux State (characterSlice.createImageUrl)
  ↓ createCharacterAction({ name, description, imageUrl })
GraphAPI (characterGraphApi.create)
  ↓ POST /characters { id, name, description, imageUrl }
Repository (characterRepository.create)
  ↓ INSERT INTO Character
GraphDB (Character node with imageUrl)
```

---

## 開発時の注意事項

### 改行コード
- 全ファイルをLFで作成する（Windowsでも改行コードはLF）

### 機能開発完了チェックリスト
1. **バックエンドテスト**
   - [ ] 統合テスト実行・全テスト通過確認
   - [ ] lint・型チェック実行

2. **フロントエンドテスト**
   - [ ] Hook/コンポーネントの作成
   - [ ] lint・型チェック実行
   - [ ] ビルドエラー確認

3. **E2Eテスト（BDD）**
   - [ ] **BDDテスト実行・全シナリオ通過確認**
   - [ ] フロントエンド実装後の統合動作確認

4. **完了判定**
   - [ ] 上記3項目の全て完了
   - [ ] 証跡記録・設計判断記録
   - [ ] 依存関係・制約事項の明確化

---

## Git情報（2025-11-05時点）
- **現在のブランチ**: `id/36/addImage`
- **メインブランチ**: `main`
- **最新コミット**:
  - `157d100` - add D&D #36
  - `5a9673c` - add ImageComponent #36
  - `c1e7456` - Merge branch 'id/35/refactor'
