import * as v from 'valibot';

/**
 * 関係性スキーマ
 * A→Bの関係を表す（双方向関係の場合、A→BとB→Aを別々に管理）
 */
export const RelationshipSchema = v.object({
  /** 関係性ID */
  id: v.string(),
  /** 関係元キャラクターID */
  fromCharacterId: v.string(),
  /** 関係先キャラクターID */
  toCharacterId: v.string(),
  /** 関係名（例: "友人", "敵対", "師匠"） */
  relationshipName: v.string(),
});

/**
 * 関係性作成・更新用の入力データスキーマ
 */
export const RelationshipFormDataSchema = v.object({
  /** 関係元キャラクターID */
  fromCharacterId: v.string(),
  /** 関係先キャラクターID */
  toCharacterId: v.string(),
  /** 関係名 */
  relationshipName: v.string(),
});

/**
 * 関係性の型
 */
export type Relationship = v.InferOutput<typeof RelationshipSchema>;

/**
 * 関係性作成・更新用の入力データ型
 */
export type RelationshipFormData = v.InferOutput<
  typeof RelationshipFormDataSchema
>;

/**
 * パース時にRelationship型に変換するスキーマ
 */
export const parseToRelationship = (data: unknown): Relationship => {
  return v.parse(RelationshipSchema, data);
};
