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
      return { data: result };
    },
  },
  {
    type: 'scene:graph:createScene',
    handler: async (payload: unknown) => {
      const params = parseCreateScenePayload(payload);
      const result = await sceneGraphRepository.createScene(params);
      return { data: result };
    },
  },
  {
    type: 'scene:graph:updateScene',
    handler: async (payload: unknown) => {
      const params = parseUpdateScenePayload(payload);
      const result = await sceneGraphRepository.updateScene(params);
      return { data: result };
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
      return { data: result };
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
];
