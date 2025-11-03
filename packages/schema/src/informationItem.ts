import * as v from 'valibot';
import { DescriptionSchema } from './common';

/**
 * 情報項目スキーマ
 */
const InformationItemSchema = v.object({
  /** 情報項目ID */
  id: v.string(),
  /** 情報項目タイトル */
  title: v.string(),
  /** 情報項目の説明 */
  description: DescriptionSchema,
  /** 所属するシナリオID */
  scenarioId: v.string(),
});

export type InformationItem = v.InferOutput<typeof InformationItemSchema>;

export const parseInformationItemSchema = (t: unknown) =>
  v.parse(InformationItemSchema, t);

export const parseInformationItemListSchema = (t: unknown) =>
  v.parse(v.array(InformationItemSchema), t);

export const safeParseInformationItemSchema = (t: unknown) =>
  v.safeParse(InformationItemSchema, t);

/**
 * 情報項目同士の関連スキーマ
 */
const InformationItemConnectionSchema = v.object({
  /** 関連ID */
  id: v.string(),
  /** 関連元の情報項目ID */
  source: v.string(),
  /** 関連先の情報項目ID */
  target: v.string(),
});

export type InformationItemConnection = v.InferOutput<
  typeof InformationItemConnectionSchema
>;

export const parseInformationItemConnectionSchema = (t: unknown) =>
  v.parse(InformationItemConnectionSchema, t);

export const parseInformationItemConnectionListSchema = (t: unknown) =>
  v.parse(v.array(InformationItemConnectionSchema), t);

/**
 * シーン-情報項目の関連スキーマ（シーンで獲得できる情報）
 */
const SceneInformationConnectionSchema = v.object({
  /** 関連ID */
  id: v.string(),
  /** シーンID */
  sceneId: v.string(),
  /** 情報項目ID */
  informationItemId: v.string(),
});

export type SceneInformationConnection = v.InferOutput<
  typeof SceneInformationConnectionSchema
>;

export const parseSceneInformationConnectionSchema = (t: unknown) =>
  v.parse(SceneInformationConnectionSchema, t);

export const parseSceneInformationConnectionListSchema = (t: unknown) =>
  v.parse(v.array(SceneInformationConnectionSchema), t);

/**
 * 情報項目-シーンの関連スキーマ（情報項目が指し示すシーン）
 */
const InformationToSceneConnectionSchema = v.object({
  /** 関連ID */
  id: v.string(),
  /** 情報項目ID */
  informationItemId: v.string(),
  /** シーンID */
  sceneId: v.string(),
});

export type InformationToSceneConnection = v.InferOutput<
  typeof InformationToSceneConnectionSchema
>;

export const parseInformationToSceneConnectionSchema = (t: unknown) =>
  v.parse(InformationToSceneConnectionSchema, t);

export const parseInformationToSceneConnectionListSchema = (t: unknown) =>
  v.parse(v.array(InformationToSceneConnectionSchema), t);

// ============================================================
// Worker handler payload schemas
// ============================================================

/**
 * シナリオIDで情報項目一覧を取得するペイロード
 */
const GetInformationItemsByScenarioIdPayloadSchema = v.object({
  scenarioId: v.string(),
});

export const parseGetInformationItemsByScenarioIdPayload = (t: unknown) =>
  v.parse(GetInformationItemsByScenarioIdPayloadSchema, t);

/**
 * 情報項目IDで情報項目を取得するペイロード
 */
const GetInformationItemByIdPayloadSchema = v.object({
  id: v.string(),
});

export const parseGetInformationItemByIdPayload = (t: unknown) =>
  v.parse(GetInformationItemByIdPayloadSchema, t);

/**
 * 情報項目作成ペイロード
 */
const CreateInformationItemPayloadSchema = v.object({
  scenarioId: v.string(),
  id: v.string(),
  title: v.string(),
  description: v.string(),
});

export const parseCreateInformationItemPayload = (t: unknown) =>
  v.parse(CreateInformationItemPayloadSchema, t);

/**
 * 情報項目更新ペイロード
 */
const UpdateInformationItemPayloadSchema = v.object({
  id: v.string(),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
});

export const parseUpdateInformationItemPayload = (t: unknown) =>
  v.parse(UpdateInformationItemPayloadSchema, t);

/**
 * 情報項目削除ペイロード
 */
const DeleteInformationItemPayloadSchema = v.object({
  id: v.string(),
});

export const parseDeleteInformationItemPayload = (t: unknown) =>
  v.parse(DeleteInformationItemPayloadSchema, t);

/**
 * 情報項目同士の関連作成ペイロード
 */
const CreateInformationConnectionPayloadSchema = v.object({
  id: v.string(),
  source: v.string(),
  target: v.string(),
});

export const parseCreateInformationConnectionPayload = (t: unknown) =>
  v.parse(CreateInformationConnectionPayloadSchema, t);

/**
 * 情報項目同士の関連削除ペイロード
 */
const DeleteInformationConnectionPayloadSchema = v.object({
  id: v.string(),
});

export const parseDeleteInformationConnectionPayload = (t: unknown) =>
  v.parse(DeleteInformationConnectionPayloadSchema, t);

/**
 * シナリオIDで情報項目の関連一覧を取得するペイロード
 */
const GetInformationConnectionsByScenarioIdPayloadSchema = v.object({
  scenarioId: v.string(),
});

export const parseGetInformationConnectionsByScenarioIdPayload = (t: unknown) =>
  v.parse(GetInformationConnectionsByScenarioIdPayloadSchema, t);

/**
 * シーン-情報項目の関連作成ペイロード
 */
const CreateSceneInformationConnectionPayloadSchema = v.object({
  id: v.string(),
  sceneId: v.string(),
  informationItemId: v.string(),
});

export const parseCreateSceneInformationConnectionPayload = (t: unknown) =>
  v.parse(CreateSceneInformationConnectionPayloadSchema, t);

/**
 * シーン-情報項目の関連削除ペイロード
 */
const DeleteSceneInformationConnectionPayloadSchema = v.object({
  id: v.string(),
});

export const parseDeleteSceneInformationConnectionPayload = (t: unknown) =>
  v.parse(DeleteSceneInformationConnectionPayloadSchema, t);

/**
 * シーンIDでシーン-情報項目の関連一覧を取得するペイロード
 */
const GetSceneInformationConnectionsBySceneIdPayloadSchema = v.object({
  sceneId: v.string(),
});

export const parseGetSceneInformationConnectionsBySceneIdPayload = (t: unknown) =>
  v.parse(GetSceneInformationConnectionsBySceneIdPayloadSchema, t);

/**
 * 情報項目IDでシーン-情報項目の関連一覧を取得するペイロード
 */
const GetSceneInformationConnectionsByInformationItemIdPayloadSchema = v.object({
  informationItemId: v.string(),
});

export const parseGetSceneInformationConnectionsByInformationItemIdPayload = (
  t: unknown,
) =>
  v.parse(GetSceneInformationConnectionsByInformationItemIdPayloadSchema, t);

/**
 * 情報項目-シーンの関連作成ペイロード（情報項目が指し示すシーン）
 */
const CreateInformationToSceneConnectionPayloadSchema = v.object({
  id: v.string(),
  informationItemId: v.string(),
  sceneId: v.string(),
});

export const parseCreateInformationToSceneConnectionPayload = (t: unknown) =>
  v.parse(CreateInformationToSceneConnectionPayloadSchema, t);

/**
 * 情報項目-シーンの関連削除ペイロード
 */
const DeleteInformationToSceneConnectionPayloadSchema = v.object({
  id: v.string(),
});

export const parseDeleteInformationToSceneConnectionPayload = (t: unknown) =>
  v.parse(DeleteInformationToSceneConnectionPayloadSchema, t);

/**
 * 情報項目IDで情報項目-シーンの関連一覧を取得するペイロード
 */
const GetInformationToSceneConnectionsByInformationItemIdPayloadSchema = v.object({
  informationItemId: v.string(),
});

export const parseGetInformationToSceneConnectionsByInformationItemIdPayload = (
  t: unknown,
) =>
  v.parse(GetInformationToSceneConnectionsByInformationItemIdPayloadSchema, t);

/**
 * シーンIDで情報項目-シーンの関連一覧を取得するペイロード
 */
const GetInformationToSceneConnectionsBySceneIdPayloadSchema = v.object({
  sceneId: v.string(),
});

export const parseGetInformationToSceneConnectionsBySceneIdPayload = (
  t: unknown,
) =>
  v.parse(GetInformationToSceneConnectionsBySceneIdPayloadSchema, t);
