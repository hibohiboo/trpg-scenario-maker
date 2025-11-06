import * as v from 'valibot';

/**
 * シナリオスキーマ（Date型）
 * UI層で使用するスキーマ
 */
export const ScenarioSchema = v.object({
  /** シナリオID */
  id: v.string(),
  /** シナリオタイトル */
  title: v.string(),
  /** 作成日時 */
  createdAt: v.date(),
  /** 更新日時 */
  updatedAt: v.date(),
});

/**
 * シナリオスキーマ（string型）
 * API層やRedux Stateで使用するスキーマ
 */
export const SerializableScenarioSchema = v.object({
  /** シナリオID */
  id: v.string(),
  /** シナリオタイトル */
  title: v.string(),
  /** 作成日時 */
  createdAt: v.string(),
  /** 更新日時 */
  updatedAt: v.string(),
});

/**
 * シナリオ作成・更新用の入力データスキーマ
 */
export const ScenarioFormDataSchema = v.object({
  /** シナリオタイトル */
  title: v.string(),
});

/**
 * シナリオの型（Date型）
 */
export type Scenario = v.InferOutput<typeof ScenarioSchema>;

/**
 * シナリオの型（string型）
 */
export type SerializableScenario = v.InferOutput<
  typeof SerializableScenarioSchema
>;

/**
 * シナリオ作成・更新用の入力データ型
 */
export type ScenarioFormData = v.InferOutput<typeof ScenarioFormDataSchema>;

/**
 * Scenario（Date型）をScenarioString（string型）に変換
 */
export function scenarioToString(scenario: Scenario): SerializableScenario {
  return {
    id: scenario.id,
    title: scenario.title,
    createdAt: scenario.createdAt.toISOString(),
    updatedAt: scenario.updatedAt.toISOString(),
  };
}

/**
 * ScenarioString（string型）をScenario（Date型）に変換
 */
export function stringToScenario(
  scenarioString: SerializableScenario,
): Scenario {
  return {
    id: scenarioString.id,
    title: scenarioString.title,
    createdAt: new Date(scenarioString.createdAt),
    updatedAt: new Date(scenarioString.updatedAt),
  };
}

/**
 * パース時にstring型に変換するスキーマ
 * API等から取得したデータをScenarioString型に変換する
 */
export const parseToScenarioString = (data: unknown): SerializableScenario => {
  return v.parse(SerializableScenarioSchema, data);
};

/**
 * パース時にDate型に変換するスキーマ
 * ScenarioStringからScenarioに変換する
 */
export const parseToScenario = (data: unknown): Scenario => {
  // まずScenarioStringとしてパース
  const scenarioString = v.parse(SerializableScenarioSchema, data);
  // その後Date型に変換
  return stringToScenario(scenarioString);
};

// === Payload Schemas ===

/**
 * シナリオ作成ペイロードスキーマ
 */
export const CreateScenarioPayloadSchema = v.object({
  title: v.string(),
});

/**
 * シナリオ更新ペイロードスキーマ
 */
export const UpdateScenarioPayloadSchema = v.object({
  id: v.string(),
  data: v.object({
    title: v.string(),
  }),
});

/**
 * シナリオID取得ペイロードスキーマ
 */
export const ScenarioIdPayloadSchema = v.object({
  id: v.string(),
});

// === Payload Parse Functions ===

export const parseCreateScenarioPayload = (data: unknown) => {
  return v.parse(CreateScenarioPayloadSchema, data);
};

export const parseUpdateScenarioPayload = (data: unknown) => {
  return v.parse(UpdateScenarioPayloadSchema, data);
};

export const parseScenarioIdPayload = (data: unknown) => {
  return v.parse(ScenarioIdPayloadSchema, data);
};

// === Response Parse Functions ===

/**
 * シナリオレスポンスをパース（string型）
 */
export const parseScenario = (data: unknown): SerializableScenario => {
  return scenarioToString(v.parse(ScenarioSchema, data));
};

/**
 * シナリオリストをパース（string型）
 */
export const parseScenarioList = (data: unknown): SerializableScenario[] => {
  return v.parse(v.array(ScenarioSchema), data).map(scenarioToString);
};

/**
 * シナリオ数をパース
 */
export const parseScenarioCount = (data: unknown): number => {
  return v.parse(v.number(), data);
};
