# シナリオ Export/Import 機能実装タスクリスト

## 概要

シナリオを完全なデータとしてZIP形式でエクスポートし、別環境でインポートできる機能を実装します。

- **Export形式**: ZIP（metadata.json + GraphDB + RDB）
- **Import時の動作**: 全エンティティのIDを新規発番して重複を回避

---

## データ構造設計

### Export形式（ZIP構造）

```
scenario_[scenarioTitle].zip
├── metadata.json          # シナリオメタデータ（バージョン、エクスポート日時）
├── graphdb/
│   ├── nodes.json        # 全ノードデータ
│   └── relationships.json # 全リレーションデータ
└── rdb/
    ├── scenario.json     # シナリオRDBデータ
    └── images.json       # 画像データ配列
```

### metadata.json 構造

```json
{
  "version": "1.0",
  "exportedAt": "2025-11-10T12:34:56.789Z",
  "scenarioId": "original-uuid",
  "scenarioTitle": "シナリオタイトル"
}
```

### ID再発番戦略

1. **UUID変換マップ**を作成: `Map<oldId, newId>`
2. **RDB**: 新しいUUIDで挿入
3. **GraphDB**: 全ノード・リレーションのIDを変換マップで置換

---

## 実装タスク

### Phase 1: スキーマ・ユーティリティ層

- [ ] **A-1**: `packages/schema/src/export.ts` 作成
  - ExportDataSchema（metadata, graphdb, rdb）
  - ImportDataSchema
  - パース関数

- [ ] **A-2**: @zip.js/zip.jsパッケージ追加
  ```bash
  cd packages/utility
  bun add @zip.js/zip.js
  ```

- [ ] **A-3**: `packages/utility/src/zip.ts` 作成
  - `exportToZip(data: ExportData): Promise<Blob>`
  - `importFromZip(zipBlob: Blob): Promise<ExportData>`

- [ ] **A-4**: `packages/utility/src/idMapper.ts` 作成
  - `createIdMap(oldIds: string[]): Map<string, string>`
  - `remapIds(data: unknown, idMap: Map<string, string>): unknown`

---

### Phase 2: Repository層（GraphDB）

- [ ] **B-1**: `packages/graphdb/src/queries/exportRepository.ts` 作成
  - `exportScenarioGraph(scenarioId: string)`
    - 全ノード取得（Scenario, Scene, Character, InformationItem, Image等）
    - 全リレーション取得（HAS_SCENE, NEXT_SCENE, APPEARS_IN等）
    - JSON形式で返却

- [ ] **B-2**: `packages/graphdb/src/queries/importRepository.ts` 作成
  - `importScenarioGraph(nodes: Node[], relationships: Relationship[])`
    - ノード一括挿入
    - リレーション一括挿入

- [ ] **B-3**: GraphDB Repository単体テスト
  ```bash
  cd packages/graphdb
  bun test src/queries/exportRepository.test.ts
  bun test src/queries/importRepository.test.ts
  ```

---

### Phase 3: Repository層（RDB）

- [ ] **C-1**: `packages/rdb/src/queries/exportRepository.ts` 作成
  - `exportScenario(scenarioId: string)`
    - シナリオレコード取得
    - 関連画像取得（character_images経由）
    - JSON形式で返却

- [ ] **C-2**: `packages/rdb/src/queries/importRepository.ts` 作成
  - `importScenario(scenario: Scenario, images: Image[])`
    - シナリオ挿入
    - 画像一括挿入

- [ ] **C-3**: RDB Repository単体テスト
  ```bash
  cd packages/rdb
  bun test src/queries/exportRepository.test.ts
  bun test src/queries/importRepository.test.ts
  ```

---

### Phase 4: Frontend Worker層

- [ ] **D-1**: `apps/frontend/src/entities/scenario/workers/exportHandlers.ts` 作成
  - `scenario:export` ハンドラー
    1. GraphDB exportRepository呼び出し
    2. RDB exportRepository呼び出し
    3. metadata.json生成
    4. ZIP圧縮（zipユーティリティ使用）
    5. Blobを返却

- [ ] **D-2**: `apps/frontend/src/entities/scenario/workers/importHandlers.ts` 作成
  - `scenario:import` ハンドラー
    1. ZIP解凍（zipユーティリティ使用）
    2. metadata.jsonパース
    3. ID変換マップ生成（idMapperユーティリティ使用）
    4. RDB importRepository呼び出し（新ID）
    5. GraphDB importRepository呼び出し（新ID）
    6. 新シナリオIDを返却

- [ ] **D-3**: Worker登録
  - `apps/frontend/src/workers/db.worker.ts` にハンドラー追加
  - `apps/frontend/src/workers/graphdb.worker.ts` にハンドラー追加

---

### Phase 5: Frontend API・Redux層

- [ ] **E-1**: `apps/frontend/src/entities/scenario/api/scenarioExportApi.ts` 作成
  - `exportScenario(scenarioId: string): Promise<Blob>`

- [ ] **E-2**: `apps/frontend/src/entities/scenario/api/scenarioImportApi.ts` 作成
  - `importScenario(zipBlob: Blob): Promise<string>` (新scenarioIdを返却)

- [ ] **E-3**: `apps/frontend/src/entities/scenario/hooks/useExportScenario.ts` 作成
  - エクスポート実行フック
  - ダウンロード処理

- [ ] **E-4**: `apps/frontend/src/entities/scenario/hooks/useImportScenario.ts` 作成
  - インポート実行フック
  - Redux Stateへの反映

---

### Phase 6: UI層

- [ ] **F-1**: `packages/ui/src/scenario/ScenarioExportButton.tsx` 作成
  - エクスポートボタンUI
  - ファイルダウンロードトリガー

- [ ] **F-2**: `packages/ui/src/scenario/ScenarioImportButton.tsx` 作成
  - インポートボタンUI
  - ファイルアップロード（input type="file" accept=".zip"）

- [ ] **F-3**: UI統合
  - シナリオ一覧ページにエクスポートボタン追加
  - シナリオ一覧ページにインポートボタン追加

---

### Phase 7: テスト

- [ ] **G-1**: BDD Feature作成
  - `apps/frontend/tests/features/scenario-export-import.feature`
  - シナリオ作成→キャラクター追加→シーン追加→エクスポート→インポート→検証

- [ ] **G-2**: BDD Steps作成
  - `apps/frontend/tests/steps/scenario-export-import.steps.ts`

- [ ] **G-3**: BDDテスト実行
  ```bash
  cd apps/frontend
  bun run test:e2e
  ```

- [ ] **G-4**: バックエンドテスト実行
  ```bash
  cd packages/graphdb && bun test
  cd packages/rdb && bun test
  ```

- [ ] **G-5**: フロントエンド型チェック・lint
  ```bash
  cd apps/frontend
  bun run typecheck
  bun run lint
  ```

- [ ] **G-6**: フロントエンドビルド確認
  ```bash
  bun run build
  ```

---

## 完了判定基準

- [ ] エクスポートボタンからZIPファイルがダウンロードできる
- [ ] ZIPファイルを解凍すると、metadata.json、graphdb/、rdb/ が存在する
- [ ] インポートボタンからZIPファイルをアップロードできる
- [ ] インポート後、新しいシナリオIDで全データが復元される
- [ ] インポートしたシナリオのキャラクター・シーン・画像が全て表示される
- [ ] 全BDDテストが通過する
- [ ] 全ユニットテストが通過する
- [ ] 型チェック・lintエラーがない
- [ ] ビルドが成功する

---

## 技術スタック

- **ZIP圧縮**: @zip.js/zip.js (積極的にメンテナンスされている現代的なライブラリ)
- **UUID生成**: crypto.randomUUID()
- **ファイルダウンロード**: Blob + URL.createObjectURL()
- **ファイルアップロード**: input type="file" + FileReader

---

## 設計ノート

### なぜZIP形式か？

- 複数のJSONファイルを1つにまとめる
- ブラウザでの扱いが容易（single file download/upload）
- 将来的に画像を別ファイルとして保存する拡張性
- @zip.js/zip.js: 2024年も活発に開発されている、Worker対応、ストリーム対応の現代的なライブラリ

### なぜID再発番か？

- 既存のシナリオとの衝突を回避
- 複数回インポートしても安全
- データの独立性を保証

### データ整合性の保証

- Export時: トランザクション的に全データを取得
- Import時: バリデーション→ID変換→一括挿入の順で実行
- エラー時はロールバック（GraphDB/RDB両方）
