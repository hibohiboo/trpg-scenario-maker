import * as v from 'valibot';
import { SceneEventSchema } from './sceneEvent';

const SceneConnectionSchema = v.object({
  /** ${source}|${target}をリレーションのIDとする */
  id: v.string(),
  source: v.string(),
  target: v.string(),
});
export const parseSceneConnectionSchema = (t: unknown) =>
  v.parse(SceneConnectionSchema, t);

export const parseSceneConnectionListSchema = (t: unknown) =>
  v.parse(v.array(SceneConnectionSchema), t);

export type SceneConnection = v.InferOutput<typeof SceneConnectionSchema>;

/**
 * descriptionフィールドのスキーマ
 * nullの場合は空文字に変換する
 */
const DescriptionSchema = v.pipe(
  v.nullable(v.string()),
  v.transform((value) => value ?? ''),
);

const SceneSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: DescriptionSchema,
  isMasterScene: v.boolean(),
  events: v.optional(v.array(SceneEventSchema)),
});
export type Scene = v.InferOutput<typeof SceneSchema>;
export const parseSceneSchema = (t: unknown) => v.parse(SceneSchema, t);
export const parseSceneListSchema = (t: unknown) =>
  v.parse(v.array(SceneSchema), t);
export const safeParseSceneSchema = (t: unknown) => v.safeParse(SceneSchema, t);

// Worker handler payload schemas
const GetScenesByScenarioIdPayloadSchema = v.object({
  scenarioId: v.string(),
});

const GetConnectionsByScenarioIdPayloadSchema = v.object({
  scenarioId: v.string(),
});

const CreateScenePayloadSchema = v.object({
  scenarioId: v.string(),
  id: v.string(),
  title: v.string(),
  description: v.string(),
  isMasterScene: v.boolean(),
});

const UpdateScenePayloadSchema = v.object({
  id: v.string(),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  isMasterScene: v.optional(v.boolean()),
});

const DeleteScenePayloadSchema = v.object({
  id: v.string(),
});

const CreateConnectionPayloadSchema = v.object({
  source: v.string(),
  target: v.string(),
});

const DeleteConnectionPayloadSchema = v.string();

export const parseGetScenesByScenarioIdPayload = (t: unknown) =>
  v.parse(GetScenesByScenarioIdPayloadSchema, t);

export const parseGetConnectionsByScenarioIdPayload = (t: unknown) =>
  v.parse(GetConnectionsByScenarioIdPayloadSchema, t);

export const parseCreateScenePayload = (t: unknown) =>
  v.parse(CreateScenePayloadSchema, t);

export const parseUpdateScenePayload = (t: unknown) =>
  v.parse(UpdateScenePayloadSchema, t);

export const parseDeleteScenePayload = (t: unknown) =>
  v.parse(DeleteScenePayloadSchema, t);

export const parseCreateConnectionPayload = (t: unknown) =>
  v.parse(CreateConnectionPayloadSchema, t);

export const parseDeleteConnectionPayload = (t: unknown) =>
  v.parse(DeleteConnectionPayloadSchema, t);
