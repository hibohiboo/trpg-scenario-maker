import { informationItemRepository } from '@trpg-scenario-maker/graphdb';
import {
  parseGetInformationItemsByScenarioIdPayload,
  parseCreateInformationItemPayload,
  parseUpdateInformationItemPayload,
  parseDeleteInformationItemPayload,
  parseCreateInformationConnectionPayload,
  parseDeleteInformationConnectionPayload,
  parseGetInformationConnectionsByScenarioIdPayload,
  parseCreateSceneInformationConnectionPayload,
  parseDeleteSceneInformationConnectionPayload,
  parseGetSceneInformationConnectionsBySceneIdPayload,
  parseCreateInformationToSceneConnectionPayload,
  parseDeleteInformationToSceneConnectionPayload,
  parseGetInformationToSceneConnectionsByInformationItemIdPayload,
  parseInformationItemListSchema,
  parseInformationItemConnectionListSchema,
  parseSceneInformationConnectionListSchema,
  parseInformationToSceneConnectionListSchema,
} from '@trpg-scenario-maker/schema';

/**
 * 情報項目のグラフDB操作ハンドラー
 */
export const informationItemGraphHandlers = [
  {
    type: 'informationItem:graph:getInformationItemsByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } =
        parseGetInformationItemsByScenarioIdPayload(payload);
      const result =
        await informationItemRepository.getInformationItemsByScenarioId(
          scenarioId,
        );
      return { data: parseInformationItemListSchema(result) };
    },
  },
  {
    type: 'informationItem:graph:createInformationItem',
    handler: async (payload: unknown) => {
      const params = parseCreateInformationItemPayload(payload);
      const result =
        await informationItemRepository.createInformationItem(params);
      const [data] = parseInformationItemListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to create information item: No result returned from database',
        );
      }
      return { data };
    },
  },
  {
    type: 'informationItem:graph:updateInformationItem',
    handler: async (payload: unknown) => {
      const params = parseUpdateInformationItemPayload(payload);
      const result =
        await informationItemRepository.updateInformationItem(params);
      const [data] = parseInformationItemListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to update information item: Item not found or no result returned',
        );
      }
      return { data };
    },
  },
  {
    type: 'informationItem:graph:deleteInformationItem',
    handler: async (payload: unknown) => {
      const { id } = parseDeleteInformationItemPayload(payload);
      await informationItemRepository.deleteInformationItem(id);
      return { success: true };
    },
  },
  {
    type: 'informationItem:graph:getInformationConnectionsByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } =
        parseGetInformationConnectionsByScenarioIdPayload(payload);
      const result =
        await informationItemRepository.getInformationConnectionsByScenarioId(
          scenarioId,
        );
      return { data: parseInformationItemConnectionListSchema(result) };
    },
  },
  {
    type: 'informationItem:graph:createInformationConnection',
    handler: async (payload: unknown) => {
      const params = parseCreateInformationConnectionPayload(payload);
      const result =
        await informationItemRepository.createInformationConnection(params);
      const [data] = parseInformationItemConnectionListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to create information connection: No result returned from database',
        );
      }
      return { data };
    },
  },
  {
    type: 'informationItem:graph:deleteInformationConnection',
    handler: async (payload: unknown) => {
      const { id } = parseDeleteInformationConnectionPayload(payload);
      await informationItemRepository.deleteInformationConnection(id);
      return { success: true };
    },
  },
  {
    type: 'informationItem:graph:getSceneInformationConnectionsBySceneId',
    handler: async (payload: unknown) => {
      const { sceneId } =
        parseGetSceneInformationConnectionsBySceneIdPayload(payload);
      const result =
        await informationItemRepository.getSceneInformationConnectionsBySceneId(
          sceneId,
        );
      return { data: parseSceneInformationConnectionListSchema(result) };
    },
  },
  {
    type: 'informationItem:graph:createSceneInformationConnection',
    handler: async (payload: unknown) => {
      const params = parseCreateSceneInformationConnectionPayload(payload);
      const result =
        await informationItemRepository.createSceneInformationConnection(
          params,
        );
      const [data] = parseSceneInformationConnectionListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to create scene-information connection: No result returned from database',
        );
      }
      return { data };
    },
  },
  {
    type: 'informationItem:graph:deleteSceneInformationConnection',
    handler: async (payload: unknown) => {
      const { id } = parseDeleteSceneInformationConnectionPayload(payload);
      await informationItemRepository.deleteSceneInformationConnection(id);
      return { success: true };
    },
  },
  {
    type: 'informationItem:graph:getInformationToSceneConnectionsByInformationItemId',
    handler: async (payload: unknown) => {
      const { informationItemId } =
        parseGetInformationToSceneConnectionsByInformationItemIdPayload(
          payload,
        );
      const result =
        await informationItemRepository.getInformationToSceneConnectionsByInformationItemId(
          informationItemId,
        );
      return { data: parseInformationToSceneConnectionListSchema(result) };
    },
  },
  {
    type: 'informationItem:graph:createInformationToSceneConnection',
    handler: async (payload: unknown) => {
      const params = parseCreateInformationToSceneConnectionPayload(payload);
      const result =
        await informationItemRepository.createInformationToSceneConnection(
          params,
        );
      const [data] = parseInformationToSceneConnectionListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to create information-to-scene connection: No result returned from database',
        );
      }
      return { data };
    },
  },
  {
    type: 'informationItem:graph:deleteInformationToSceneConnection',
    handler: async (payload: unknown) => {
      const { id } = parseDeleteInformationToSceneConnectionPayload(payload);
      await informationItemRepository.deleteInformationToSceneConnection(id);
      return { success: true };
    },
  },
  {
    type: 'informationItem:graph:getSceneInformationConnectionsByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } =
        parseGetInformationConnectionsByScenarioIdPayload(payload);
      const result =
        await informationItemRepository.getSceneInformationConnectionsByScenarioId(
          scenarioId,
        );
      return { data: parseSceneInformationConnectionListSchema(result) };
    },
  },
  {
    type: 'informationItem:graph:getInformationToSceneConnectionsByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } =
        parseGetInformationConnectionsByScenarioIdPayload(payload);

      const result =
        await informationItemRepository.getInformationToSceneConnectionsByScenarioId(
          scenarioId,
        );
      return { data: parseInformationToSceneConnectionListSchema(result) };
    },
  },
] as const;

type InformationItemGraphHandler =
  (typeof informationItemGraphHandlers)[number];

export type InformationItemGraphHandlerMap = {
  [H in InformationItemGraphHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
