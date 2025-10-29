import { sceneEventRepository } from '@trpg-scenario-maker/graphdb';
import {
  parseGetEventsBySceneIdPayload,
  parseCreateEventPayload,
  parseUpdateEventPayload,
  parseDeleteEventPayload,
  parseUpdateEventOrderPayload,
  parseSceneEventListSchema,
  type SceneEvent,
} from '@trpg-scenario-maker/schema';

/**
 * シーンイベントのグラフDB操作ハンドラー
 */
export const sceneEventHandlers = [
  {
    type: 'sceneEvent:graph:getEventsBySceneId',
    handler: async (payload: unknown) => {
      const { sceneId } = parseGetEventsBySceneIdPayload(payload);
      const result = await sceneEventRepository.getEventsBySceneId(sceneId);
      const data: SceneEvent[] = parseSceneEventListSchema(result);
      return { data };
    },
  },
  {
    type: 'sceneEvent:graph:createEvent',
    handler: async (payload: unknown) => {
      const params = parseCreateEventPayload(payload);
      const result = await sceneEventRepository.createEvent(params);
      const [data] = parseSceneEventListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to create event: No result returned from database',
        );
      }
      return { data };
    },
  },
  {
    type: 'sceneEvent:graph:updateEvent',
    handler: async (payload: unknown) => {
      const params = parseUpdateEventPayload(payload);
      const result = await sceneEventRepository.updateEvent(params);
      const [data] = parseSceneEventListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to update event: Event not found or no result returned',
        );
      }
      return { data };
    },
  },
  {
    type: 'sceneEvent:graph:deleteEvent',
    handler: async (payload: unknown) => {
      const { id } = parseDeleteEventPayload(payload);
      await sceneEventRepository.deleteEvent(id);
      return { success: true };
    },
  },
  {
    type: 'sceneEvent:graph:updateEventOrder',
    handler: async (payload: unknown) => {
      const { eventOrders } = parseUpdateEventOrderPayload(payload);
      await sceneEventRepository.updateEventOrder(eventOrders);
      return { success: true };
    },
  },
] as const;

type SceneEventHandler = (typeof sceneEventHandlers)[number];

export type SceneEventHandlerMap = {
  [H in SceneEventHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? Promise<D>
    : never;
};
