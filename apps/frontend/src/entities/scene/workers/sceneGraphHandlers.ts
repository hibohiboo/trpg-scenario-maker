import { sceneGraphRepository } from '@trpg-scenario-maker/graphdb';

/**
 * シーンのグラフDB操作ハンドラー
 */
export const sceneGraphHandlers = [
  {
    type: 'scene:graph:getScenesByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } = payload as { scenarioId: string };
      const result =
        await sceneGraphRepository.getScenesByScenarioId(scenarioId);
      return { data: result };
    },
  },
  {
    type: 'scene:graph:getConnectionsByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } = payload as { scenarioId: string };
      const result =
        await sceneGraphRepository.getConnectionsByScenarioId(scenarioId);
      return { data: result };
    },
  },
  {
    type: 'scene:graph:createScene',
    handler: async (payload: unknown) => {
      const params = payload as {
        scenarioId: string;
        id: string;
        title: string;
        description: string;
        isMasterScene: boolean;
      };
      const result = await sceneGraphRepository.createScene(params);
      return { data: result };
    },
  },
  {
    type: 'scene:graph:updateScene',
    handler: async (payload: unknown) => {
      const params = payload as {
        id: string;
        title?: string;
        description?: string;
        isMasterScene?: boolean;
      };
      const result = await sceneGraphRepository.updateScene(params);
      return { data: result };
    },
  },
  {
    type: 'scene:graph:deleteScene',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
      await sceneGraphRepository.deleteScene(id);
      return { success: true };
    },
  },
  {
    type: 'scene:graph:createConnection',
    handler: async (payload: unknown) => {
      const params = payload as { source: string; target: string };
      const result = await sceneGraphRepository.createConnection(params);
      return { data: result };
    },
  },
  {
    type: 'scene:graph:deleteConnection',
    handler: async (payload: unknown) => {
      const params = payload as string;
      await sceneGraphRepository.deleteConnection(params);
      return { success: true };
    },
  },
];
