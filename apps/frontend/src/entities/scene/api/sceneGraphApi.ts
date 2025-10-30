import { parseSceneConnectionSchema } from '@trpg-scenario-maker/schema/scene';
import type { Scene, SceneConnection } from '@trpg-scenario-maker/ui';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import type { SceneGraphHandlerMap } from '../workers/sceneGraphHandlers';

/**
 * シーンのグラフDB操作API
 * GraphDBWorkerClientを使用して、シーン固有のAPI操作を提供
 */
export const sceneGraphApi = {
  /**
   * シナリオに属するシーンを取得
   */
  getScenesByScenarioId: async (scenarioId: string): Promise<Scene[]> => {
    const key = 'scene:graph:getScenesByScenarioId';
    const result = await graphdbWorkerClient.request<
      SceneGraphHandlerMap[typeof key]
    >(key, { scenarioId });

    return result;
  },

  /**
   * シーン間の接続を取得
   */
  getConnectionsByScenarioId: async (
    scenarioId: string,
  ): Promise<SceneConnection[]> => {
    const key = 'scene:graph:getConnectionsByScenarioId';
    const result = await graphdbWorkerClient.request<
      SceneGraphHandlerMap[typeof key]
    >(key, { scenarioId });

    return result;
  },

  /**
   * シーンを作成
   */
  createScene: async (
    scenarioId: string,
    scene: Omit<Scene, 'id'>,
  ): Promise<Scene> => {
    const key = 'scene:graph:createScene';
    const id = crypto.randomUUID();
    const result = await graphdbWorkerClient.request<
      SceneGraphHandlerMap[typeof key]
    >(key, {
      scenarioId,
      id,
      title: scene.title,
      description: scene.description,
      isMasterScene: scene.isMasterScene,
    });

    return result;
  },

  /**
   * シーンを更新
   */
  updateScene: async (id: string, updates: Partial<Scene>): Promise<Scene> => {
    const key = 'scene:graph:updateScene';
    const result = await graphdbWorkerClient.request<
      SceneGraphHandlerMap[typeof key]
    >(key, {
      id,
      ...updates,
    });

    return result;
  },

  /**
   * シーンを削除
   */
  deleteScene: async (id: string): Promise<void> => {
    const key = 'scene:graph:deleteScene';
    await graphdbWorkerClient.request<SceneGraphHandlerMap[typeof key]>(key, {
      id,
    });
  },

  /**
   * シーン間の接続を作成
   */
  createConnection: async (
    connection: Omit<SceneConnection, 'id'>,
  ): Promise<SceneConnection> => {
    const key = 'scene:graph:createConnection';
    const result = await graphdbWorkerClient.request<
      SceneGraphHandlerMap[typeof key]
    >(key, {
      source: connection.source,
      target: connection.target,
    });

    const [r] = result;
    return parseSceneConnectionSchema(r);
  },

  /**
   * シーン間の接続を削除
   */
  deleteConnection: async (id: string): Promise<void> => {
    const key = 'scene:graph:deleteConnection';
    await graphdbWorkerClient.request<SceneGraphHandlerMap[typeof key]>(
      key,
      id,
    );
  },

  /**
   * データベースを永続化
   */
  save: async () => {
    await graphdbWorkerClient.save();
  },
} as const;
