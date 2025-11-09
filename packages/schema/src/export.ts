import * as v from 'valibot';

/**
 * エクスポートメタデータスキーマ
 */
export const ExportMetadataSchema = v.object({
  /** データ構造バージョン */
  version: v.string(),
  /** エクスポート日時 */
  exportedAt: v.string(),
  /** 元のシナリオID */
  scenarioId: v.string(),
  /** シナリオタイトル */
  scenarioTitle: v.string(),
});

/**
 * GraphDBノードスキーマ
 */
export const GraphNodeSchema = v.object({
  /** ノードID */
  id: v.string(),
  /** ノードラベル（Scenario, Scene, Character等） */
  label: v.string(),
  /** ノードプロパティ */
  properties: v.record(v.string(), v.unknown()),
});

/**
 * GraphDBリレーションスキーマ
 */
export const GraphRelationshipSchema = v.object({
  /** リレーションタイプ（HAS_SCENE, APPEARS_IN等） */
  type: v.string(),
  /** FROM ノードID */
  from: v.string(),
  /** TO ノードID */
  to: v.string(),
  /** リレーションプロパティ */
  properties: v.record(v.string(), v.unknown()),
});

/**
 * GraphDBデータスキーマ
 */
export const GraphDBDataSchema = v.object({
  /** 全ノード */
  nodes: v.array(GraphNodeSchema),
  /** 全リレーション */
  relationships: v.array(GraphRelationshipSchema),
});

/**
 * RDB画像データスキーマ
 */
export const RDBImageSchema = v.object({
  /** 画像ID */
  id: v.string(),
  /** Data URL */
  dataUrl: v.string(),
  /** 作成日時 */
  createdAt: v.string(),
});

/**
 * RDBシナリオデータスキーマ
 */
export const RDBScenarioSchema = v.object({
  /** シナリオID */
  id: v.string(),
  /** タイトル */
  title: v.string(),
  /** 作成日時 */
  createdAt: v.string(),
  /** 更新日時 */
  updatedAt: v.string(),
});

/**
 * RDBデータスキーマ
 */
export const RDBDataSchema = v.object({
  /** シナリオデータ */
  scenario: RDBScenarioSchema,
  /** 画像データ配列 */
  images: v.array(RDBImageSchema),
});

/**
 * エクスポートデータ全体スキーマ
 */
export const ExportDataSchema = v.object({
  /** メタデータ */
  metadata: ExportMetadataSchema,
  /** GraphDBデータ */
  graphdb: GraphDBDataSchema,
  /** RDBデータ */
  rdb: RDBDataSchema,
});

/**
 * インポートデータスキーマ（エクスポートと同じ構造）
 */
export const ImportDataSchema = ExportDataSchema;

// === 型定義 ===

export type ExportMetadata = v.InferOutput<typeof ExportMetadataSchema>;
export type GraphNode = v.InferOutput<typeof GraphNodeSchema>;
export type GraphRelationship = v.InferOutput<typeof GraphRelationshipSchema>;
export type GraphDBData = v.InferOutput<typeof GraphDBDataSchema>;
export type RDBImage = v.InferOutput<typeof RDBImageSchema>;
export type RDBScenario = v.InferOutput<typeof RDBScenarioSchema>;
export type RDBData = v.InferOutput<typeof RDBDataSchema>;
export type ExportData = v.InferOutput<typeof ExportDataSchema>;
export type ImportData = v.InferOutput<typeof ImportDataSchema>;

// === パース関数 ===

/**
 * エクスポートデータをパース
 */
export const parseExportData = (data: unknown): ExportData => {
  return v.parse(ExportDataSchema, data);
};

/**
 * インポートデータをパース
 */
export const parseImportData = (data: unknown): ImportData => {
  return v.parse(ImportDataSchema, data);
};

/**
 * メタデータをパース
 */
export const parseExportMetadata = (data: unknown): ExportMetadata => {
  return v.parse(ExportMetadataSchema, data);
};

/**
 * GraphDBデータをパース
 */
export const parseGraphDBData = (data: unknown): GraphDBData => {
  return v.parse(GraphDBDataSchema, data);
};

/**
 * RDBデータをパース
 */
export const parseRDBData = (data: unknown): RDBData => {
  return v.parse(RDBDataSchema, data);
};
