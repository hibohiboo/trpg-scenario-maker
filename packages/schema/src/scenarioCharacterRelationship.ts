import * as v from 'valibot';

/**
 * シナリオ内のキャラクター関係性スキーマ
 * シナリオごとに異なる関係性を管理（例: シナリオAでは友人、シナリオBでは敵対）
 */
export const ScenarioCharacterRelationshipSchema = v.object({
  /** シナリオID */
  scenarioId: v.string(),
  /** 関係元キャラクターID */
  fromCharacterId: v.string(),
  /** 関係先キャラクターID */
  toCharacterId: v.string(),
  /** 関係名（例: "友人", "敵対", "師匠"） */
  relationshipName: v.string(),
});

/**
 * シナリオキャラクター関係性作成・更新用の入力データスキーマ
 */
export const ScenarioCharacterRelationshipFormDataSchema = v.object({
  /** シナリオID */
  scenarioId: v.string(),
  /** 関係元キャラクターID */
  fromCharacterId: v.string(),
  /** 関係先キャラクターID */
  toCharacterId: v.string(),
  /** 関係名 */
  relationshipName: v.string(),
});

/**
 * シナリオキャラクター関係性の型
 */
export type ScenarioCharacterRelationship = v.InferOutput<
  typeof ScenarioCharacterRelationshipSchema
>;

/**
 * シナリオキャラクター関係性作成・更新用の入力データ型
 */
export type ScenarioCharacterRelationshipFormData = v.InferOutput<
  typeof ScenarioCharacterRelationshipFormDataSchema
>;

/**
 * パース時にScenarioCharacterRelationship型に変換
 */
export const parseToScenarioCharacterRelationship = (
  data: unknown
): ScenarioCharacterRelationship => {
  return v.parse(ScenarioCharacterRelationshipSchema, data);
};

/**
 * シナリオキャラクター関係性リストをパース
 */
export const parseToScenarioCharacterRelationshipList = (
  data: unknown
): ScenarioCharacterRelationship[] => {
  return v.parse(v.array(ScenarioCharacterRelationshipSchema), data);
};
