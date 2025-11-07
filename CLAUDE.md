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

**Entity層** - ドメインモデルのCRUD操作
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

**Feature層** - ビジネス機能単位（複数のentityを組み合わせ）
```
apps/frontend/src/feature/scenarioCharacterManagement/
├── hooks/
│   └── useCharacterManagement.ts  # キャラクター管理の統合ロジック
├── ui/
│   └── CharacterTabContent.tsx    # キャラクタータブのUIコンテナ
└── index.ts
```

**Widget層** - 複合UIコンポーネント（featureを組み合わせ）
```
apps/frontend/src/widget/TabNavigationBar/
├── ui/
│   └── TabNavigationBar.tsx       # タブナビゲーションUI
├── types.ts
└── index.ts
```

**Page層** - ルーティング単位（widget/featureの組み立て）
```
apps/frontend/src/page/scenarioDetail/
├── ui/
│   └── Page.tsx                   # タブ切り替えのみ（約65行）
└── models/
    └── scenarioDetailSlice.ts     # タブ状態管理
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

## キャラクター画像機能の実装方針（2025-11-05調査・更新）

### 要件
1. **1キャラクター:N画像の多対多関係**を実装
2. 画像はUUIDをキーにData URLをRDBに保存
3. GraphDBは`Image`ノードと`HAS_IMAGE`リレーション（Character → Image）を持つ
4. `HAS_IMAGE`リレーションに`isPrimary`プロパティを持ち、メイン画像を指定
5. 表示時はRDBから画像を取得して表示

### データ構造

#### RDB (PostgreSQL)
```sql
-- images テーブル
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- character_images 中間テーブル
CREATE TABLE character_images (
  character_id UUID NOT NULL,
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (character_id, image_id)
);
```

#### GraphDB (Neo4j/Kuzu)
```
Character ノード
  - id: STRING
  - name: STRING
  - description: STRING

Image ノード
  - id: STRING

HAS_IMAGE リレーション
  - FROM Character TO Image
  - isPrimary: BOOLEAN
```

### 実装が必要な箇所

#### A. スキーマ層
- [ ] `packages/schema/src/image.ts` - 新規作成（ImageSchema, CharacterImageSchema）
- [ ] `packages/schema/src/character.ts` - `primaryImageId`フィールド追加、`CharacterWithImagesSchema`作成
- [ ] `packages/schema/src/scenarioCharacter.ts` - `primaryImageId`フィールド追加

#### B. データベース層（RDB）
- [ ] `packages/rdb/src/schema.ts` - `images`テーブル、`character_images`中間テーブル定義
- [ ] RDB Migration生成 - `bun run db:generate`
- [ ] `packages/rdb/src/queries/imageRepository.ts` - 新規作成（CRUD操作）
- [ ] `packages/rdb/src/queries/characterImageRepository.ts` - 新規作成（関連付け操作）

#### C. データベース層（GraphDB）
- [ ] `packages/graphdb/src/schemas.ts` - `Image`ノード、`HAS_IMAGE`リレーション（isPrimary付き）定義
- [ ] `packages/graphdb/src/queries/imageRepository.ts` - 新規作成（Imageノード、HAS_IMAGEリレーション操作）
- [ ] `packages/graphdb/src/queries/characterRepository.ts` - `primaryImageId`取得ロジック追加

#### D. フロントエンド API層
- [ ] `apps/frontend/src/entities/image/api/imageApi.ts` - 新規作成（RDB API呼び出し）
- [ ] `apps/frontend/src/entities/image/model/imageSlice.ts` - 新規作成（Redux状態管理）
- [ ] `apps/frontend/src/entities/character/model/characterSlice.ts` - 画像配列状態管理追加
- [ ] `apps/frontend/src/entities/character/actions/characterActions.ts` - 画像作成・関連付けロジック追加
- [ ] `apps/frontend/src/entities/character/hooks/useCreateCharacter.ts` - 画像配列フック追加
- [ ] `apps/frontend/src/entities/image/hooks/useCharacterImages.ts` - 新規作成

#### E. UI層
- [ ] `packages/ui/src/character/CharacterImageGallery.tsx` - 新規作成（画像ギャラリー）
- [ ] `packages/ui/src/character/CharacterCreateModal.tsx` - CharacterImageGallery統合
- [ ] `packages/ui/src/character/CharacterList.tsx` - メイン画像表示追加
- [ ] `packages/ui/src/character/types.ts` - `primaryImageId`追加

#### F. テスト層
- [ ] BDD Feature作成 - `character-image.feature`
- [ ] BDD Steps作成 - `character-image.steps.ts`
- [ ] Unit Test作成・更新 - imageRepository, characterImageRepository, characterRepository

### データフロー

#### 画像作成・関連付けフロー
```
UI (CharacterImageGallery)
  ↓ onAddImage(dataUrl)
Redux State (characterSlice.createImageDataUrls)
  ↓ createCharacterAction()
    1. キャラクター作成
    2. imageDataUrls をループ
       ↓ imageApi.createImage(dataUrl)
       RDB: INSERT INTO images → 画像ID取得
       ↓ imageApi.linkToCharacter(characterId, imageId, isPrimary)
       RDB: INSERT INTO character_images
       GraphDB: CREATE (c:Character)-[:HAS_IMAGE {isPrimary}]->(i:Image)
    3. Redux: imageSlice.setImage(imageId, dataUrl)
```

#### 画像表示フロー
```
UI (CharacterList)
  ↓ useCharacterImages(characterId)
Redux State (imageSlice.characterImages)
  ↓ 未キャッシュの場合
    ↓ imageApi.getCharacterImages(characterId)
    RDB: SELECT * FROM character_images JOIN images
    ↓ Redux: imageSlice.setCharacterImages(characterId, images)
  ↓ メイン画像のみ取得
    ↓ imageApi.getPrimaryImage(characterId)
    RDB: SELECT * FROM character_images WHERE is_primary=true
  ↓ 表示
UI: <img src={primaryImage.dataUrl} />
```

---

## フロントエンドアーキテクチャ（Feature-Sliced Design）

### ディレクトリ構造

```
apps/frontend/src/
├── app/                          # アプリケーション層（ルーティング・store）
│   ├── App.tsx
│   ├── Router.tsx
│   └── store/
│
├── page/                         # ページ層（ルーティング単位）
│   ├── agreement/
│   ├── scenario/
│   ├── character/
│   └── scenarioDetail/
│       ├── ui/
│       │   └── Page.tsx          # タブナビゲーション + feature組み立てのみ
│       └── models/
│           └── scenarioDetailSlice.ts
│
├── feature/                      # ビジネス機能単位
│   ├── scenarioSceneManagement/
│   ├── scenarioCharacterManagement/
│   └── scenarioInformationManagement/
│
├── widget/                       # 複合UIコンポーネント
│   └── TabNavigationBar/
│
├── entities/                     # エンティティ層（ドメインモデル）
│   ├── character/
│   ├── image/
│   ├── scenario/
│   ├── scene/
│   ├── scenarioCharacter/
│   ├── sceneEvent/
│   └── informationItem/
│
└── shared/                       # 共有層（汎用ユーティリティ）
    └── lib/store/
```

### 依存関係ルール

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

### 各層の責務

#### Entity層
- **責務**: ドメインモデルのCRUD操作、API通信、Redux状態管理
- **含めるもの**: 単一エンティティに特化したhooks、API、Redux slices
- **例**: `useCharacterList()`, `characterGraphApi.create()`

#### Feature層
- **責務**: ビジネスロジックの統合、基本的なUI構造
- **含めるもの**: 複数のentity hooksを組み合わせたカスタムフック、基本的なリスト/フォーム/モーダルUI
- **依存可能**: entities のみ（widgetは使えない）
- **例**: `useCharacterManagement()` - キャラクターCRUD + 関係性管理を統合

#### Widget層
- **責務**: 複雑なUI、複数のfeatureの組み合わせ、高度なビジュアライゼーション
- **含めるもの**: 複数のfeatureを組み合わせた複合UI、グラフ表示、ギャラリー
- **依存可能**: feature, entities
- **例**: `TabNavigationBar` - 汎用タブナビゲーション

#### Page層
- **責務**: ルーティング、レイアウト、widget/featureの組み立て
- **原則**: widgetを優先的に使い、シンプルなUIはfeatureを直接使う
- **依存可能**: widget, feature, entities

### リファクタリング成果（scenarioDetailページ）

| 項目 | リファクタ前 | リファクタ後 |
|------|-------------|-------------|
| Page.tsx | 175行, 77 props | 65行, 0 props |
| 最大hook行数 | 533行（GOD HOOK） | 約120行/feature |
| feature層 | なし | 3 features |
| widget層 | なし | 1 widget |
| 再利用性 | 低い | 高い（feature単位） |
| テスト容易性 | 困難 | 容易（feature独立） |

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
