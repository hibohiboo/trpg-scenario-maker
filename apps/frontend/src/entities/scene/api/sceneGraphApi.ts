import type { Scene, SceneConnection } from '@trpg-scenario-maker/ui';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

/**
 * シーンのグラフDB操作API
 * GraphDBWorkerClientを使用して、シーン固有のAPI操作を提供
 */
export const sceneGraphApi = {
  /**
   * シナリオに属するシーンを取得
   */
  getScenesByScenarioId: async (scenarioId: string): Promise<Scene[]> => {
    const result = await graphdbWorkerClient.request<Scene[]>(
      'scene:graph:getScenesByScenarioId',
      { scenarioId },
    );
    return result;
  },

  /**
   * シーン間の接続を取得
   */
  getConnectionsByScenarioId: async (
    scenarioId: string,
  ): Promise<SceneConnection[]> => {
    const result = await graphdbWorkerClient.request<
      Array<{ source: string; target: string }>
    >('scene:graph:getConnectionsByScenarioId', { scenarioId });
    return result.map((item) => ({
      id: `${item.source}-${item.target}`,
      source: item.source,
      target: item.target,
    }));
  },

  /**
   * シーンを作成
   */
  createScene: async (
    scenarioId: string,
    scene: Omit<Scene, 'id'>,
  ): Promise<Scene> => {
    const id = crypto.randomUUID();
    const result = await graphdbWorkerClient.request<Scene[]>(
      'scene:graph:createScene',
      {
        scenarioId,
        id,
        title: scene.title,
        description: scene.description,
        isMasterScene: scene.isMasterScene,
      },
    );

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error(
        'Failed to create scene: No result returned from database',
      );
    }

    return result[0];
  },

  /**
   * シーンを更新
   */
  updateScene: async (id: string, updates: Partial<Scene>): Promise<Scene> => {
    const result = await graphdbWorkerClient.request<Scene[]>(
      'scene:graph:updateScene',
      {
        id,
        ...updates,
      },
    );

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error(
        'Failed to update scene: Scene not found or no result returned',
      );
    }

    return result[0];
  },

  /**
   * シーンを削除
   */
  deleteScene: async (id: string): Promise<void> => {
    await graphdbWorkerClient.request('scene:graph:deleteScene', { id });
  },

  /**
   * シーン間の接続を作成
   */
  createConnection: async (
    connection: Omit<SceneConnection, 'id'>,
  ): Promise<SceneConnection> => {
    const result = await graphdbWorkerClient.request<SceneConnection[]>(
      'scene:graph:createConnection',
      {
        source: connection.source,
        target: connection.target,
      },
    );

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error(
        'Failed to create connection: No result returned from database',
      );
    }

    return result[0];
  },

  /**
   * シーン間の接続を削除
   */
  deleteConnection: async (id: string): Promise<void> => {
    const [source, target] = id.split('-');
    await graphdbWorkerClient.request('scene:graph:deleteConnection', {
      source,
      target,
    });
  },

  /**
   * データベースを永続化
   */
  save: async () => {
    await graphdbWorkerClient.save();
  },
} as const;
