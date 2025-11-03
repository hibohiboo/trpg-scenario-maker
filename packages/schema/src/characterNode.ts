import * as v from 'valibot';

/**
 * キャラクターノードデータスキーマ
 * ReactFlowで使用するキャラクターノードのデータ構造
 */
export const characterNodeDataSchema = v.object({
  name: v.string(),
  role: v.optional(v.string()),
  description: v.optional(v.string()),
});

export type CharacterNodeData = v.InferOutput<typeof characterNodeDataSchema>;

/**
 * キャラクターノードデータの安全なパース
 */
export function safeParseCharacterNodeData(data: unknown) {
  return v.safeParse(characterNodeDataSchema, data);
}
