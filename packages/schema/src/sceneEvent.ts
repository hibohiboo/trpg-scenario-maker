import * as v from 'valibot';

const SceneEventTypeSchema = v.picklist([
  'start',
  'conversation',
  'choice',
  'battle',
  'treasure',
  'trap',
  'puzzle',
  'rest',
  'ending',
]);

const SceneEventSchema = v.object({
  id: v.string(),
  type: SceneEventTypeSchema,
  content: v.string(),
  order: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const parseSceneEventSchema = (t: unknown) =>
  v.parse(SceneEventSchema, t);

export type SceneEvent = v.InferOutput<typeof SceneEventSchema>;
export type SceneEventType = v.InferOutput<typeof SceneEventTypeSchema>;
