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

export type SceneConnection = v.InferOutput<typeof SceneConnectionSchema>;
const SceneSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.string(),
  isMasterScene: v.boolean(),
  events: v.optional(v.array(SceneEventSchema)),
});
export type Scene = v.InferOutput<typeof SceneSchema>;
export const parseSceneSchema = (t: unknown) => v.parse(SceneSchema, t);
