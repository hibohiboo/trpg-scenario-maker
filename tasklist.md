# キャラクター画像機能実装タスクリスト

## 概要
キャラクターに画像を設定できる機能を実装する。
- **1キャラクター:N画像の多対多関係**
- 画像はUUIDをキーにData URLをRDBに保存
- GraphDBは`Image`ノードと`HAS_IMAGE`リレーション（Character → Image）を持つ
- `HAS_IMAGE`リレーションに`isPrimary`プロパティを持ち、メイン画像を指定可能
- 表示時はRDBから画像を取得して表示

---

## Phase 1: スキーマ・データベース層

### 1.1 型定義の更新

#### 1.1.1 Image Schema作成
- [ ] `packages/schema/src/image.ts` (新規作成)
  - `ImageSchema` - 画像の基本スキーマ
    ```typescript
    export const ImageSchema = v.object({
      id: v.string(),
      dataUrl: v.string(),
      createdAt: v.optional(v.string()),
    });
    ```
  - `CharacterImageSchema` - キャラクター画像関連スキーマ
    ```typescript
    export const CharacterImageSchema = v.object({
      characterId: v.string(),
      imageId: v.string(),
      isPrimary: v.boolean(),
    });
    ```
  - パース関数: `parseToImage`, `parseToImageList`, `parseToCharacterImage`

#### 1.1.2 Character Schema更新
- [ ] `packages/schema/src/character.ts`
  - `CharacterSchema`に`primaryImageId?: v.optional(v.string())`を追加
  - `CharacterWithImagesSchema`を作成（画像配列を含む）
    ```typescript
    export const CharacterWithImagesSchema = v.object({
      ...CharacterSchema.entries,
      images: v.optional(v.array(ImageSchema)),
    });
    ```

#### 1.1.3 ScenarioCharacter Schema更新
- [ ] `packages/schema/src/scenarioCharacter.ts`
  - `ScenarioCharacterSchema`に`primaryImageId?: v.optional(v.string())`を追加

### 1.2 RDB スキーマ・マイグレーション

#### 1.2.1 スキーマ定義
- [ ] `packages/rdb/src/schema.ts`
  - `images`テーブル定義追加
    ```typescript
    export const imagesTable = pgTable('images', {
      id: uuid('id').primaryKey().defaultRandom(),
      dataUrl: text('data_url').notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
      updatedAt: timestamp('updated_at').defaultNow().notNull(),
    });
    ```

  - `characterImages`中間テーブル定義追加
    ```typescript
    export const characterImagesTable = pgTable('character_images', {
      characterId: uuid('character_id').notNull(),
      imageId: uuid('image_id').notNull().references(() => imagesTable.id, { onDelete: 'cascade' }),
      isPrimary: boolean('is_primary').default(false).notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
    }, (table) => ({
      pk: primaryKey({ columns: [table.characterId, table.imageId] }),
    }));
    ```

#### 1.2.2 マイグレーション作成
- [ ] RDBマイグレーション生成
  - `bun run db:generate` でマイグレーションファイル生成
  - 生成されたSQLファイルを確認・調整

### 1.3 GraphDB スキーマ更新
- [ ] `packages/graphdb/src/schemas.ts`
  - `Image`ノード定義追加
    ```typescript
    {
      name: 'Image',
      query: `
        CREATE NODE TABLE Image (
          id STRING,
          PRIMARY KEY (id)
        )`
    }
    ```

  - `HAS_IMAGE`リレーション定義追加（isPrimaryプロパティ付き）
    ```typescript
    {
      name: 'HAS_IMAGE',
      query: `
        CREATE REL TABLE HAS_IMAGE (
          FROM Character TO Image,
          isPrimary BOOLEAN
        )`
    }
    ```

### 1.4 テスト: スキーマバリデーション
- [ ] `packages/schema/src/character.test.ts` (新規作成)
  - `imageUrl`フィールドのバリデーションテスト
  - オプショナルフィールドのテスト

---

## Phase 2: バックエンド層（RDB）

### 2.1 Image Repository作成
- [ ] `packages/rdb/src/queries/imageRepository.ts` (新規作成)
  - `create(dataUrl: string): Promise<{ id: string }>` - 画像作成（IDは自動生成）
  - `findById(id: string): Promise<{ id: string; dataUrl: string } | null>`
  - `delete(id: string): Promise<void>`
  - `findByCharacterId(characterId: string): Promise<Image[]>` - キャラクターの全画像取得

### 2.2 CharacterImage Repository作成
- [ ] `packages/rdb/src/queries/characterImageRepository.ts` (新規作成)
  - `link(characterId: string, imageId: string, isPrimary: boolean): Promise<void>` - 関連付け
  - `unlink(characterId: string, imageId: string): Promise<void>` - 関連解除
  - `setPrimary(characterId: string, imageId: string): Promise<void>` - メイン画像設定
  - `findByCharacterId(characterId: string): Promise<CharacterImage[]>`
  - `getPrimaryImage(characterId: string): Promise<Image | null>` - メイン画像取得

### 2.3 テスト: Image Repository
- [ ] `packages/rdb/src/queries/imageRepository.test.ts` (新規作成)
  - CRUD操作のテスト
  - エラーハンドリングテスト

### 2.4 テスト: CharacterImage Repository
- [ ] `packages/rdb/src/queries/characterImageRepository.test.ts` (新規作成)
  - 関連付け・解除のテスト
  - メイン画像設定のテスト
  - 複数画像の取得テスト

---

## Phase 3: バックエンド層（GraphDB）

### 3.1 Image Repository作成
- [ ] `packages/graphdb/src/queries/imageRepository.ts` (新規作成)
  - `createImageNode(id: string): Promise<void>` - Imageノード作成
  - `deleteImageNode(id: string): Promise<void>` - Imageノード削除
  - `linkToCharacter(characterId: string, imageId: string, isPrimary: boolean): Promise<void>` - HAS_IMAGEリレーション作成
  - `unlinkFromCharacter(characterId: string, imageId: string): Promise<void>` - HAS_IMAGEリレーション削除
  - `getCharacterImages(characterId: string): Promise<{ imageId: string; isPrimary: boolean }[]>` - キャラクターの画像ID一覧取得

### 3.2 Character Repository更新
- [ ] `packages/graphdb/src/queries/characterRepository.ts`
  - `findById()`の戻り値に`primaryImageId?: string`を追加
  - `findAll()`の戻り値に`primaryImageId?: string`を追加
  - クエリで`HAS_IMAGE`リレーション（isPrimary=true）からメイン画像IDを取得

### 3.3 テスト: Image Repository
- [ ] `packages/graphdb/src/queries/imageRepository.test.ts` (新規作成)
  - Imageノードの作成・削除テスト
  - HAS_IMAGEリレーションの作成・削除テスト
  - 複数画像の取得テスト
  - isPrimaryフラグのテスト

### 3.4 テスト: Character Repository
- [ ] `packages/graphdb/src/queries/characterRepository.test.ts`
  - `primaryImageId`を含む取得処理のテスト
  - 画像なしキャラクターの下位互換テスト

### 3.3 統合テスト実行
- [ ] `npm run test` (packages/graphdb)
  - 全テスト通過確認
  - lint・型チェック実行

---

## Phase 4: フロントエンド API層

### 4.1 Image API作成
- [ ] `apps/frontend/src/entities/image/api/imageApi.ts` (新規作成)
  - RDB API:
    - `createImage(dataUrl: string): Promise<{ id: string }>` - 画像作成
    - `findImageById(id: string): Promise<{ dataUrl: string } | null>` - 画像取得
    - `deleteImage(id: string): Promise<void>` - 画像削除
    - `linkToCharacter(characterId: string, imageId: string, isPrimary: boolean): Promise<void>` - 関連付け
    - `unlinkFromCharacter(characterId: string, imageId: string): Promise<void>` - 関連解除
    - `getCharacterImages(characterId: string): Promise<Image[]>` - キャラクター画像一覧
    - `getPrimaryImage(characterId: string): Promise<Image | null>` - メイン画像取得

### 4.2 Character Graph API更新
- [ ] `apps/frontend/src/entities/character/api/characterGraphApi.ts`
  - レスポンス型に`primaryImageId?: string`追加（変更なし、取得のみ）

### 4.3 Redux State管理

#### 4.3.1 Image Slice作成
- [ ] `apps/frontend/src/entities/image/model/imageSlice.ts` (新規作成)
  - 状態定義:
    ```typescript
    {
      imagesById: Record<string, string>, // id → dataUrl
      characterImages: Record<string, string[]>, // characterId → imageIds
    }
    ```
  - Actions:
    - `setImage(id, dataUrl)` - 画像キャッシュ
    - `removeImage(id)` - 画像削除
    - `setCharacterImages(characterId, imageIds)` - キャラクター画像一覧設定
    - `setCharacterPrimaryImage(characterId, imageId)` - メイン画像設定

#### 4.3.2 Character Slice更新
- [ ] `apps/frontend/src/entities/character/model/characterSlice.ts`
  - 状態に追加:
    - `createImageDataUrls: string[]` - 作成フォームの画像Data URL配列
    - `editImageDataUrls: string[]` - 編集フォームの画像Data URL配列
    - `createPrimaryImageIndex: number` - 作成時のメイン画像インデックス
  - Actions追加:
    - `addCreateImageDataUrl(dataUrl: string)` - 画像追加
    - `removeCreateImageDataUrl(index: number)` - 画像削除
    - `setCreatePrimaryImageIndex(index: number)` - メイン画像設定
    - `clearCreateImages()` - 画像クリア

### 4.4 Character Actions更新
- [ ] `apps/frontend/src/entities/character/actions/characterActions.ts`
  - `createCharacterAction`の実装更新:
    1. `imageDataUrls`をループして`imageApi.createImage()`を呼び出し
    2. 各画像IDを取得
    3. キャラクター作成後、各画像を`imageApi.linkToCharacter()`で関連付け
    4. メイン画像を`isPrimary: true`で設定
    5. 画像をRedux stateにキャッシュ
  - `updateCharacterAction`も同様の処理

### 4.5 Hooks作成・更新

#### 4.5.1 useCreateCharacter更新
- [ ] `apps/frontend/src/entities/character/hooks/useCreateCharacter.ts`
  - 返り値に追加:
    - `imageDataUrls: string[]` - 画像URL配列
    - `addImageDataUrl: (url: string) => void` - 画像追加
    - `removeImageDataUrl: (index: number) => void` - 画像削除
    - `primaryImageIndex: number` - メイン画像インデックス
    - `setPrimaryImageIndex: (index: number) => void` - メイン画像設定

#### 4.5.2 useCharacterImages作成
- [ ] `apps/frontend/src/entities/image/hooks/useCharacterImages.ts` (新規作成)
  - `useCharacterImages(characterId: string): { images: Image[]; primaryImage: Image | null }`
  - キャラクターの画像一覧とメイン画像を取得
  - Redux stateから取得、未キャッシュの場合はAPIから取得

### 4.6 lint・型チェック
- [ ] `npm run lint` (apps/frontend)
- [ ] `npm run type-check` (apps/frontend)

---

## Phase 5: UI層

### 5.1 CharacterImageGallery作成
- [ ] `packages/ui/src/character/CharacterImageGallery.tsx` (新規作成)
  - 複数画像のサムネイル表示
  - 画像追加ボタン（ImageInput統合）
  - 画像削除ボタン
  - メイン画像の選択UI（ラジオボタンまたはスター）
  - Props:
    - `images: { dataUrl: string; isPrimary: boolean }[]`
    - `onAddImage: (dataUrl: string) => void`
    - `onRemoveImage: (index: number) => void`
    - `onSetPrimary: (index: number) => void`

### 5.2 CharacterCreateModal更新
- [ ] `packages/ui/src/character/CharacterCreateModal.tsx`
  - Props追加:
    - `imageDataUrls: string[]`
    - `onAddImage?: (url: string) => void`
    - `onRemoveImage?: (index: number) => void`
    - `primaryImageIndex?: number`
    - `onSetPrimaryImage?: (index: number) => void`
  - `CharacterImageGallery`コンポーネントを統合
  - フォームレイアウト調整

### 5.3 CharacterList更新
- [ ] `packages/ui/src/character/CharacterList.tsx`
  - キャラクターカードにメイン画像表示追加
  - 画像なしの場合のフォールバック表示
  - レイアウト調整（画像サイズ、配置）

### 5.4 型定義更新
- [ ] `packages/ui/src/character/types.ts`
  - `Character`型に`primaryImageId?: string`追加
  - Props型の更新（画像配列対応）

### 5.5 ScenarioCharacter関連UI（オプション）
- [ ] `packages/ui/src/scenarioCharacter/ScenarioCharacterFormModal.tsx`
  - 画像表示・編集機能追加
- [ ] `packages/ui/src/scenarioCharacter/ScenarioCharacterList.tsx`
  - メイン画像表示追加

### 5.5 lint・型チェック・ビルド
- [ ] `npm run lint` (packages/ui)
- [ ] `npm run type-check` (packages/ui)
- [ ] `npm run build` (packages/ui)

---

## Phase 6: E2Eテスト（BDD）

### 6.1 Feature作成
- [ ] `apps/frontend/tests/features/character-image.feature` (新規作成)
  ```gherkin
  Feature: キャラクター画像管理

  Scenario: キャラクター作成時に画像をアップロード
    Given アプリケーションを開いている
    When キャラクター作成モーダルを開く
    And 画像ファイルをアップロードする
    And キャラクター名に "テストキャラ" と入力する
    And キャラクター説明に "テスト説明" と入力する
    And 作成ボタンをクリックする
    Then キャラクターリストに "テストキャラ" が表示される
    And "テストキャラ" に画像が表示される

  Scenario: 画像なしでキャラクター作成
    Given アプリケーションを開いている
    When キャラクター作成モーダルを開く
    And キャラクター名に "画像なしキャラ" と入力する
    And 作成ボタンをクリックする
    Then キャラクターリストに "画像なしキャラ" が表示される
    And "画像なしキャラ" に画像が表示されない

  Scenario: キャラクター編集で画像を変更
    Given キャラクター "既存キャラ" が存在する
    When キャラクター編集モーダルを開く
    And 新しい画像ファイルをアップロードする
    And 保存ボタンをクリックする
    Then "既存キャラ" に新しい画像が表示される
  ```

### 6.2 ステップ定義作成
- [ ] `apps/frontend/tests/steps/character-image.steps.ts` (新規作成)
  - `When('画像ファイルをアップロードする')`
    - テスト用画像ファイルをImageInputにセット
  - `Then('{string} に画像が表示される')`
    - 画像要素の存在確認
    - Data URL形式の確認
  - `Then('{string} に画像が表示されない')`
    - 画像要素の不在確認

### 6.3 テスト実行
- [ ] `npm run test:e2e` (apps/frontend)
  - 全シナリオ通過確認
  - 既存シナリオのリグレッションテスト

---

## Phase 7: 統合確認・リファクタリング

### 7.1 統合動作確認
- [ ] フロントエンド起動
  - `npm run dev`
  - キャラクター作成で画像アップロード
  - キャラクター一覧で画像表示確認
  - キャラクター編集で画像変更確認

### 7.2 データベース確認
- [ ] RDB: `images`テーブルにData URLが保存されているか
- [ ] GraphDB: `Image`ノードと`HAS_IMAGE`リレーションが作成されているか

### 7.3 パフォーマンス確認
- [ ] 大きな画像（数MB）のアップロード動作
- [ ] Data URLのサイズ制限（必要に応じて圧縮処理追加）
- [ ] 画像キャッシュの動作確認

### 7.4 エラーハンドリング確認
- [ ] 不正な画像形式のアップロード
- [ ] ネットワークエラー時の挙動
- [ ] 画像削除時の整合性

### 7.5 リファクタリング
- [ ] コードの重複削除
- [ ] コメント・ドキュメント追加
- [ ] 型安全性の向上

---

## Phase 8: ドキュメント・完了確認

### 8.1 証跡記録
- [ ] `CLAUDE.md`に実装内容を追記
  - 画像機能のデータフロー
  - API仕様
  - トラブルシューティング

### 8.2 完了チェックリスト確認
- [ ] バックエンドテスト: 統合テスト・lint・型チェック通過
- [ ] フロントエンドテスト: lint・型チェック・ビルド成功
- [ ] E2Eテスト: 全シナリオ通過
- [ ] 依存関係・制約事項の明確化

### 8.3 Git操作
- [ ] 変更をコミット
  ```bash
  git add .
  git commit -m "feat: add character image upload feature #36"
  ```
- [ ] ブランチをpush
  ```bash
  git push origin id/36/addImage
  ```

---

## 補足: 設計判断記録

### 画像保存方式
- **選択**: RDBにData URL（base64）を保存
- **理由**:
  - ファイルシステム管理不要
  - バックアップが容易
  - トランザクション管理が簡単
- **トレードオフ**: Data URLはサイズが大きい（base64エンコードで約1.37倍）

### GraphDB構造
- **選択**: `Image`ノード + `HAS_IMAGE`リレーション（1:N関係）
- **理由**:
  - 1キャラクターに複数画像を設定可能
  - `isPrimary`プロパティでメイン画像を指定
  - 画像の再利用が可能（複数キャラクターで同じ画像を共有可能）
  - リレーショナルな構造で柔軟性が高い
  - 将来的に画像メタデータ（アップロード日時、サイズなど）を追加可能

### RDB構造
- **選択**: `images`テーブル + `character_images`中間テーブル
- **理由**:
  - 多対多の関係を正規化
  - `isPrimary`フラグで1キャラクターにつき1つのメイン画像を指定
  - 外部キー制約（ON DELETE CASCADE）で整合性を保証
  - 画像の削除時、関連する中間テーブルのレコードも自動削除

### フロントエンド状態管理
- **選択**: Redux stateで画像Data URLをキャッシュ
- **理由**:
  - 再取得の回数を削減（パフォーマンス向上）
  - オフライン対応の可能性
  - キャラクターごとの画像配列を管理
- **注意**: メモリ使用量に注意（必要に応じてLRUキャッシュ実装）

### UI設計
- **選択**: 画像ギャラリーコンポーネント（CharacterImageGallery）
- **理由**:
  - 複数画像のサムネイル表示
  - 画像の追加・削除が直感的
  - メイン画像の選択がわかりやすい（ラジオボタンまたはスターアイコン）
  - 再利用可能なコンポーネント

---

## 進捗管理

- **作成日**: 2025-11-05
- **対象ブランチ**: `id/36/addImage`
- **関連Issue**: #36
- **担当**: Claude + User

### 進捗状況
- [ ] Phase 1: スキーマ・データベース層
- [ ] Phase 2: バックエンド層（RDB）
- [ ] Phase 3: バックエンド層（GraphDB）
- [ ] Phase 4: フロントエンド API層
- [ ] Phase 5: UI層
- [ ] Phase 6: E2Eテスト（BDD）
- [ ] Phase 7: 統合確認・リファクタリング
- [ ] Phase 8: ドキュメント・完了確認
