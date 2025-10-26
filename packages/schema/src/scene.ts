import * as v from 'valibot';

const SceneConnectionSchema = v.object({
  /** ${source}|${target}をリレーションのIDとする */
  id: v.string(),
  source: v.string(),
  target: v.string(),
});
export const parseSceneConnectionSchema = (t: unknown) =>
  v.parse(SceneConnectionSchema, t);

export type SceneConnection = v.InferOutput<typeof SceneConnectionSchema>;
