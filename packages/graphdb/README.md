# @trpg-scenario-maker/graphdb

GraphDB操作パッケージ（KùzuDB使用）

## 概要

このパッケージはTRPGシナリオメーカーのグラフデータベース操作を提供します。

- **データベース**: KùzuDB (Kuzu-Wasm)
- **用途**: キャラクター、シーン、関係性などのグラフ構造データの管理

## 主要機能

### リポジトリ

- `scenarioRepository`: シナリオノードのCRUD操作
- `sceneRepository`: シーンノードとシーン間の接続管理
- `sceneEventRepository`: シーンイベントの管理
- `characterRepository`: キャラクターノードのCRUD操作
- `scenarioCharacterRepository`: シナリオとキャラクターの関連付け
- `imageRepository`: 画像ノードとキャラクター画像の関連付け
- `informationItemRepository`: 情報項目の管理
- `exportRepository`: シナリオグラフデータのエクスポート
- `importRepository`: シナリオグラフデータのインポート

## 開発時の注意事項

### KùzuDBの予約語

**重要**: KùzuDBでは特定の単語が予約語として扱われ、`AS`句でカラム名として使用できません。

#### 問題が発生する例

```cypher
// ❌ 動作しない（fromとtoは予約語）
MATCH (s:Scenario)-[r:HAS_SCENE]->(scene:Scene)
RETURN s.id AS from, scene.id AS to
```

このクエリは実行時に`result.table`が`false`になり、空配列が返されます。

#### 正しい使用例

```cypher
// ✅ 動作する（予約語を避ける）
MATCH (s:Scenario)-[r:HAS_SCENE]->(scene:Scene)
RETURN s.id AS fromId, scene.id AS toId
```

#### 既知の予約語

- `from`
- `to`

これらの単語は`AS`句でのカラム名として使用しないでください。

### テスト実行

```bash
# ユニットテスト実行
bun run test

# 特定のファイルのみ
bun run test src/queries/exportRepository.test.ts

# Lint実行
bun run lint
```

## データ構造

### ノード

- `Scenario`: シナリオ
- `Scene`: シーン
- `SceneEvent`: シーンイベント
- `Character`: キャラクター
- `Image`: 画像
- `InformationItem`: 情報項目

### リレーション

- `HAS_SCENE`: Scenario → Scene
- `NEXT_SCENE`: Scene → Scene
- `HAS_EVENT`: Scene → SceneEvent
- `APPEARS_IN`: Character → Scenario
- `RELATES_IN_SCENARIO`: Character → Character
- `HAS_IMAGE`: Character → Image
- `HAS_INFORMATION`: Scenario → InformationItem
- `INFORMATION_RELATED_TO`: InformationItem → InformationItem
- `SCENE_HAS_INFO`: Scene → InformationItem
- `INFO_POINTS_TO_SCENE`: InformationItem → Scene
