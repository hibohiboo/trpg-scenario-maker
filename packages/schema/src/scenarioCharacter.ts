import * as v from 'valibot';

/**
 * シナリオに登場するキャラクタースキーマ
 */
export const ScenarioCharacterSchema = v.object({
  /** シナリオID */
  scenarioId: v.string(),
  /** キャラクターID */
  characterId: v.string(),
  /** シナリオ内での役割（例: "主人公", "敵", "協力者"） */
  role: v.optional(v.string(), ''),
});

/**
 * シナリオキャラクター作成・更新用の入力データスキーマ
 */
export const ScenarioCharacterFormDataSchema = v.object({
  /** シナリオID */
  scenarioId: v.string(),
  /** キャラクターID */
  characterId: v.string(),
  /** シナリオ内での役割 */
  role: v.optional(v.string(), ''),
});

/**
 * シナリオキャラクターの型
 */
export type ScenarioCharacter = v.InferOutput<typeof ScenarioCharacterSchema>;

/**
 * シナリオキャラクター作成・更新用の入力データ型
 */
export type ScenarioCharacterFormData = v.InferOutput<
  typeof ScenarioCharacterFormDataSchema
>;

/**
 * パース時にScenarioCharacter型に変換
 */
export const parseToScenarioCharacter = (data: unknown): ScenarioCharacter => {
  return v.parse(ScenarioCharacterSchema, data);
};

/**
 * シナリオキャラクターリストをパース
 */
export const parseToScenarioCharacterList = (
  data: unknown
): ScenarioCharacter[] => {
  return v.parse(v.array(ScenarioCharacterSchema), data);
};
