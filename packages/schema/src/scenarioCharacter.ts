import * as v from 'valibot';
import { OptionalToStringSchema } from './common';

/**
 * シナリオに登場するキャラクタースキーマ
 */
export const ScenarioCharacterSchema = v.object({
  /** シナリオID */
  scenarioId: v.string(),
  /** キャラクターID */
  characterId: v.string(),
  /** キャラクター名 */
  name: v.string(),
  /** キャラクター説明 */
  description: OptionalToStringSchema,
  /** シナリオ内での役割（例: "主人公", "敵", "協力者"） */
  role: OptionalToStringSchema,
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
  role: OptionalToStringSchema,
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
  data: unknown,
): ScenarioCharacter[] => {
  return v.parse(v.array(ScenarioCharacterSchema), data);
};
