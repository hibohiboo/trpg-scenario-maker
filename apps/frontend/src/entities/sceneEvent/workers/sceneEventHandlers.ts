import { sceneEventRepository } from '@trpg-scenario-maker/graphdb';
import {
  parseGetEventsBySceneIdPayload,
  parseCreateEventPayload,
  parseUpdateEventPayload,
  parseDeleteEventPayload,
  parseUpdateEventOrderPayload,
  parseSceneEventListSchema,
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
      return { data: parseSceneEventListSchema(result) };
    },
  },
  {
    type: 'sceneEvent:graph:createEvent',
    handler: async (payload: unknown) => {
      const params = parseCreateEventPayload(payload);
      const result = await sceneEventRepository.createEvent(params);
      return { data: parseSceneEventListSchema(result) };
    },
  },
  {
    type: 'sceneEvent:graph:updateEvent',
    handler: async (payload: unknown) => {
      const params = parseUpdateEventPayload(payload);
      const result = await sceneEventRepository.updateEvent(params);
      return { data: parseSceneEventListSchema(result) };
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
];
