# キャラクター画像機能実装タスクリスト

## 概要
キャラクターに画像を設定できる機能を実装する。
- 画像はUUIDをキーにData URLをRDBに保存
- GraphDBは画像IDを持つノードとキャラクターの`HAS_IMAGE`リレーションを持つ
- 表示時はRDBから画像を取得して表示

---

## Phase 1: スキーマ・データベース層

### 1.1 型定義の更新
- [ ] `packages/schema/src/character.ts`
  - `CharacterSchema`に`imageUrl?: v.string()`を追加
  - 型エクスポート確認

- [ ] `packages/schema/src/scenarioCharacter.ts`
  - `ScenarioCharacterSchema`に`imageUrl?: v.string()`を追加
  - 型エクスポート確認

### 1.2 RDB スキーマ・マイグレーション
- [ ] `packages/rdb/src/schema.ts`
  - `images`テーブル定義追加
    ```typescript
    export const imagesTable = pgTable('images', {
      id: uuid('id').primaryKey(),
      dataUrl: text('data_url').notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
    });
    ```

- [ ] RDBマイグレーション作成
  - `packages/rdb/migrations/XXXX_add_images_table.sql`
  - `images`テーブル作成SQL

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

  - `HAS_IMAGE`リレーション定義追加
    ```typescript
    {
      name: 'HAS_IMAGE',
      query: `
        CREATE REL TABLE HAS_IMAGE (
          FROM Character TO Image
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
  - `create(id: string, dataUrl: string): Promise<Image>`
  - `findById(id: string): Promise<Image | null>`
  - `delete(id: string): Promise<void>`

### 2.2 テスト: Image Repository
- [ ] `packages/rdb/src/queries/imageRepository.test.ts` (新規作成)
  - CRUD操作のテスト
  - エラーハンドリングテスト

---

## Phase 3: バックエンド層（GraphDB）

### 3.1 Character Repository更新
- [ ] `packages/graphdb/src/queries/characterRepository.ts`
  - `create()`メソッドに`imageId?: string`パラメータ追加
  - `update()`メソッドに`imageId?: string`パラメータ追加
  - `HAS_IMAGE`リレーション作成ロジック追加
  - 画像IDの取得ロジック追加（`findById`, `findAll`）

### 3.2 テスト: Character Repository
- [ ] `packages/graphdb/src/queries/characterRepository.test.ts`
  - `imageId`を含むCRUD操作のテスト
  - `HAS_IMAGE`リレーションのテスト
  - 画像なしキャラクターの下位互換テスト

### 3.3 統合テスト実行
- [ ] `npm run test` (packages/graphdb)
  - 全テスト通過確認
  - lint・型チェック実行

---

## Phase 4: フロントエンド API層

### 4.1 Character Graph API更新
- [ ] `apps/frontend/src/entities/character/api/characterGraphApi.ts`
  - `create()`に`imageId?: string`パラメータ追加
  - `update()`に`imageId?: string`パラメータ追加
  - レスポンス型に`imageId`追加

### 4.2 Image API作成
- [ ] `apps/frontend/src/entities/image/api/imageApi.ts` (新規作成)
  - `create(dataUrl: string): Promise<{ id: string }>`
  - `findById(id: string): Promise<{ dataUrl: string }>`
  - `delete(id: string): Promise<void>`

### 4.3 Redux State管理

#### 4.3.1 Image Slice作成
- [ ] `apps/frontend/src/entities/image/model/imageSlice.ts` (新規作成)
  - 状態定義: `{ imagesById: Record<string, string> }` (id → dataUrl)
  - Actions:
    - `setImage(id, dataUrl)`
    - `removeImage(id)`

#### 4.3.2 Character Slice更新
- [ ] `apps/frontend/src/entities/character/model/characterSlice.ts`
  - 状態に追加:
    - `createImageDataUrl: string` - 作成フォームの画像Data URL
    - `editImageDataUrl: string` - 編集フォームの画像Data URL
  - Actions追加:
    - `setCreateImageDataUrl(dataUrl: string)`
    - `setEditImageDataUrl(dataUrl: string)`
    - `clearCreateImageDataUrl()`
    - `clearEditImageDataUrl()`

### 4.4 Character Actions更新
- [ ] `apps/frontend/src/entities/character/actions/characterActions.ts`
  - `createCharacterAction`の実装更新:
    1. `imageDataUrl`が存在する場合、`imageApi.create()`を呼び出し
    2. 取得した`imageId`を`characterGraphApi.create()`に渡す
    3. 成功後、`imageSlice.setImage()`で画像をキャッシュ
  - `updateCharacterAction`も同様の処理

### 4.5 Hooks作成・更新

#### 4.5.1 useCreateCharacter更新
- [ ] `apps/frontend/src/entities/character/hooks/useCreateCharacter.ts`
  - 返り値に追加:
    - `imageDataUrl: string`
    - `setImageDataUrl: (url: string) => void`
  - `createCharacter`内で画像アップロード処理を呼び出し

#### 4.5.2 useImageData作成
- [ ] `apps/frontend/src/entities/image/hooks/useImageData.ts` (新規作成)
  - `useImageData(imageId: string | undefined): string | undefined`
  - Redux stateから画像Data URLを取得
  - 未キャッシュの場合は`imageApi.findById()`で取得

### 4.6 lint・型チェック
- [ ] `npm run lint` (apps/frontend)
- [ ] `npm run type-check` (apps/frontend)

---

## Phase 5: UI層

### 5.1 CharacterCreateModal更新
- [ ] `packages/ui/src/character/CharacterCreateModal.tsx`
  - Props追加:
    - `imageDataUrl?: string`
    - `onImageDataUrlChange?: (url: string) => void`
  - `ImageInput`コンポーネントを統合
  - フォームレイアウト調整

### 5.2 CharacterList更新
- [ ] `packages/ui/src/character/CharacterList.tsx`
  - キャラクターカードに画像表示追加
  - 画像なしの場合のフォールバック表示
  - レイアウト調整（画像サイズ、配置）

### 5.3 型定義更新
- [ ] `packages/ui/src/character/types.ts`
  - `Character`型に`imageId?: string`追加
  - Props型の更新

### 5.4 ScenarioCharacter関連UI（オプション）
- [ ] `packages/ui/src/scenarioCharacter/ScenarioCharacterFormModal.tsx`
  - 画像表示・編集機能追加（シナリオ固有画像対応）
- [ ] `packages/ui/src/scenarioCharacter/ScenarioCharacterList.tsx`
  - 画像表示追加

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
- **選択**: `Image`ノード + `HAS_IMAGE`リレーション
- **理由**:
  - 画像の再利用が可能（複数キャラクターで同じ画像を共有可能）
  - リレーショナルな構造で柔軟性が高い
  - 将来的に画像メタデータ（アップロード日時、サイズなど）を追加可能

### フロントエンド状態管理
- **選択**: Redux stateで画像Data URLをキャッシュ
- **理由**:
  - 再取得の回数を削減（パフォーマンス向上）
  - オフライン対応の可能性
- **注意**: メモリ使用量に注意（必要に応じてLRUキャッシュ実装）

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
