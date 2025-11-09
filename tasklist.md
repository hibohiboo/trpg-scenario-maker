# キャラクター画像表示機能 実装タスクリスト

## 概要
シナリオのキャラクター一覧とグラフにメイン画像を表示する機能を実装

## 実装タスク

### A. データ取得層の実装
- [ ] RDB: `characterImageRepository.ts` - メイン画像取得クエリ実装
- [ ] GraphDB: `characterRepository.ts` - キャラクター一覧取得時に`primaryImageId`を含める
- [ ] バックエンドAPI: キャラクター取得時に`primaryImageId`を返すよう修正

### B. フロントエンドAPI層の実装
- [ ] `entities/character/api` - `primaryImageId`を含むキャラクターデータ取得
- [ ] `entities/image/api/imageApi.ts` - 画像データ取得API実装
- [ ] `entities/image/hooks/useCharacterImages.ts` - 複数キャラクターの画像取得フック作成

### C. UI層の実装
- [ ] `packages/ui/src/character/CharacterAvatar.tsx` - 新規作成（画像orプレースホルダ表示コンポーネント）
- [ ] `packages/ui/src/character/CharacterList.tsx` - CharacterAvatar統合
- [ ] `packages/ui/src/character/CharacterGraph.tsx` - CharacterAvatar統合（グラフノード表示）

### D. Redux状態管理
- [ ] `entities/image/model/imageSlice.ts` - 画像キャッシュ状態管理
- [ ] `entities/character/model/characterSlice.ts` - `primaryImageId`フィールド追加

### E. テスト
- [ ] Unit Test: `imageRepository.test.ts` - メイン画像取得テスト
- [ ] Unit Test: `characterRepository.test.ts` - `primaryImageId`取得テスト
- [ ] BDD Test: `character-image.feature` - 画像表示シナリオ追加

### F. 統合確認
- [ ] lint・型チェック実行（バックエンド）
- [ ] lint・型チェック実行（フロントエンド）
- [ ] ビルドエラー確認
- [ ] BDDテスト実行・全シナリオ通過確認

## データフロー

### 取得フロー
```
UI Component (CharacterList/CharacterGraph)
  ↓ useCharacterImages([characterId1, characterId2, ...])
Redux State (imageSlice)
  ↓ 未キャッシュの場合のみAPI呼び出し
    ↓ imageApi.getPrimaryImages([characterIds])
    RDB: SELECT * FROM character_images
         JOIN images
         WHERE character_id IN (...) AND is_primary=true
  ↓ Redux: imageSlice.setCachedImages({ characterId: dataUrl })
  ↓ 返却: Map<characterId, dataUrl | null>
UI: <CharacterAvatar imageUrl={dataUrl} name={name} />
```

### プレースホルダ仕様
- 画像がない場合: アイコンまたは頭文字を表示
- サイズ統一: 40px × 40px (一覧), 60px × 60px (グラフ)
- border-radius: 50% (円形)
- background: グレーのグラデーション

## 完了基準
- [ ] キャラクター一覧でメイン画像が表示される
- [ ] キャラクターグラフでメイン画像が表示される
- [ ] 画像がないキャラクターはプレースホルダが表示される
- [ ] レイアウト崩れがない
- [ ] 全テストが通過する
