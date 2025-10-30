import { sceneGraphRepository } from '@trpg-scenario-maker/graphdb';
import {
  parseGetScenesByScenarioIdPayload,
  parseGetConnectionsByScenarioIdPayload,
  parseCreateScenePayload,
  parseUpdateScenePayload,
  parseDeleteScenePayload,
  parseCreateConnectionPayload,
  parseDeleteConnectionPayload,
  parseSceneListSchema,
} from '@trpg-scenario-maker/schema';
import { parseSceneConnectionListSchema } from '@trpg-scenario-maker/schema/scene';

/**
 * シーンのグラフDB操作ハンドラー
 */
export const sceneGraphHandlers = [
  {
    type: 'scene:graph:getScenesByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } = parseGetScenesByScenarioIdPayload(payload);

      const result =
        await sceneGraphRepository.getScenesByScenarioId(scenarioId);

      return { data: parseSceneListSchema(result) };
    },
  },
  {
    type: 'scene:graph:getConnectionsByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } = parseGetConnectionsByScenarioIdPayload(payload);
      const result =
        await sceneGraphRepository.getConnectionsByScenarioId(scenarioId);
      return { data: parseSceneConnectionListSchema(result) };
    },
  },
  {
    type: 'scene:graph:createScene',
    handler: async (payload: unknown) => {
      const params = parseCreateScenePayload(payload);
      const result = await sceneGraphRepository.createScene(params);
      const [data] = parseSceneListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to create scene: No result returned from database',
        );
      }
      return { data };
    },
  },
  {
    type: 'scene:graph:updateScene',
    handler: async (payload: unknown) => {
      const params = parseUpdateScenePayload(payload);
      const result = await sceneGraphRepository.updateScene(params);

      const [data] = parseSceneListSchema(result);
      if (!data) {
        throw new Error(
          'Failed to update scene: Scene not found or no result returned',
        );
      }
      return { data };
    },
  },
  {
    type: 'scene:graph:deleteScene',
    handler: async (payload: unknown) => {
      const { id } = parseDeleteScenePayload(payload);
      await sceneGraphRepository.deleteScene(id);
      return { success: true };
    },
  },
  {
    type: 'scene:graph:createConnection',
    handler: async (payload: unknown) => {
      const params = parseCreateConnectionPayload(payload);
      const result = await sceneGraphRepository.createConnection(params);
      return { data: parseSceneConnectionListSchema(result) };
    },
  },
  {
    type: 'scene:graph:deleteConnection',
    handler: async (payload: unknown) => {
      const connectionId = parseDeleteConnectionPayload(payload);
      await sceneGraphRepository.deleteConnection(connectionId);
      return { success: true };
    },
  },
] as const;

type SceneGraphHandler = (typeof sceneGraphHandlers)[number];

export type SceneGraphHandlerMap = {
  [H in SceneGraphHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
