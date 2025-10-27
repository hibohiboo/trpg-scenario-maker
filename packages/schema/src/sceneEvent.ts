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

export const SceneEventSchema = v.object({
  id: v.string(),
  type: SceneEventTypeSchema,
  content: v.string(),
  sortOrder: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const parseSceneEventSchema = (t: unknown) =>
  v.parse(SceneEventSchema, t);

export const parseSceneEventListSchema = (t: unknown) =>
  v.parse(v.array(SceneEventSchema), t);

// Worker handler payload schemas
const GetEventsBySceneIdPayloadSchema = v.object({
  sceneId: v.string(),
});

const CreateEventPayloadSchema = v.object({
  sceneId: v.string(),
  id: v.string(),
  type: SceneEventTypeSchema,
  content: v.string(),
  sortOrder: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

const UpdateEventPayloadSchema = v.object({
  id: v.string(),
  type: v.optional(SceneEventTypeSchema),
  content: v.optional(v.string()),
  sortOrder: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
});

const DeleteEventPayloadSchema = v.object({
  id: v.string(),
});

const UpdateEventOrderPayloadSchema = v.object({
  eventOrders: v.array(
    v.object({
      id: v.string(),
      sortOrder: v.pipe(v.number(), v.integer(), v.minValue(0)),
    }),
  ),
});

export const parseGetEventsBySceneIdPayload = (t: unknown) =>
  v.parse(GetEventsBySceneIdPayloadSchema, t);

export const parseCreateEventPayload = (t: unknown) =>
  v.parse(CreateEventPayloadSchema, t);

export const parseUpdateEventPayload = (t: unknown) =>
  v.parse(UpdateEventPayloadSchema, t);

export const parseDeleteEventPayload = (t: unknown) =>
  v.parse(DeleteEventPayloadSchema, t);

export const parseUpdateEventOrderPayload = (t: unknown) =>
  v.parse(UpdateEventOrderPayloadSchema, t);

export type SceneEvent = v.InferOutput<typeof SceneEventSchema>;
export type SceneEventType = v.InferOutput<typeof SceneEventTypeSchema>;
