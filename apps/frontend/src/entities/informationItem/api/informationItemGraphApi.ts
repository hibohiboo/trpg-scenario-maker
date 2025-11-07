import { generateUUID } from '@trpg-scenario-maker/utility';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import type {
  InformationItem,
  InformationItemConnection,
  InformationToSceneConnection,
  SceneInformationConnection,
} from '@trpg-scenario-maker/ui';

/**
 * 情報項目のグラフDB操作API
 * GraphDBWorkerClientを使用して、情報項目固有のAPI操作を提供
 */
export const informationItemGraphApi = {
  /**
   * シナリオに属する情報項目を取得
   */
  getInformationItemsByScenarioId: async (
    scenarioId: string,
  ): Promise<InformationItem[]> => {
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:getInformationItemsByScenarioId',
      { scenarioId },
    );

    return result;
  },

  /**
   * 情報項目を作成
   */
  createInformationItem: async (
    scenarioId: string,
    item: Omit<InformationItem, 'id' | 'scenarioId'>,
  ): Promise<InformationItem> => {
    const id = generateUUID();
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:createInformationItem',
      {
        scenarioId,
        id,
        title: item.title,
        description: item.description,
      },
    );

    return result;
  },

  /**
   * 情報項目を更新
   */
  updateInformationItem: async (
    id: string,
    updates: Partial<InformationItem>,
  ): Promise<InformationItem> => {
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:updateInformationItem',
      {
        id,
        ...updates,
      },
    );

    return result;
  },

  /**
   * 情報項目を削除
   */
  deleteInformationItem: async (id: string): Promise<void> => {
    await graphdbWorkerClient.request(
      'informationItem:graph:deleteInformationItem',
      {
        id,
      },
    );
  },

  /**
   * シナリオに属する情報項目同士の関連を取得
   */
  getInformationConnectionsByScenarioId: async (
    scenarioId: string,
  ): Promise<InformationItemConnection[]> => {
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:getInformationConnectionsByScenarioId',
      { scenarioId },
    );

    return result;
  },

  /**
   * 情報項目同士の関連を作成
   */
  createInformationConnection: async (
    connection: Omit<InformationItemConnection, 'id'>,
  ): Promise<InformationItemConnection> => {
    const id = generateUUID();
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:createInformationConnection',
      {
        id,
        source: connection.source,
        target: connection.target,
      },
    );

    return result;
  },

  /**
   * 情報項目同士の関連を削除
   */
  deleteInformationConnection: async (id: string): Promise<void> => {
    await graphdbWorkerClient.request(
      'informationItem:graph:deleteInformationConnection',
      {
        id,
      },
    );
  },

  /**
   * シーンに関連する情報項目の関連を取得（シーン→情報項目）
   */
  getSceneInformationConnectionsBySceneId: async (
    sceneId: string,
  ): Promise<SceneInformationConnection[]> => {
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:getSceneInformationConnectionsBySceneId',
      { sceneId },
    );

    return result;
  },

  /**
   * シーン→情報項目の関連を作成
   */
  createSceneInformationConnection: async (
    connection: Omit<SceneInformationConnection, 'id'>,
  ): Promise<SceneInformationConnection> => {
    const id = generateUUID();
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:createSceneInformationConnection',
      {
        id,
        sceneId: connection.sceneId,
        informationItemId: connection.informationItemId,
      },
    );

    return result;
  },

  /**
   * シーン→情報項目の関連を削除
   */
  deleteSceneInformationConnection: async (id: string): Promise<void> => {
    await graphdbWorkerClient.request(
      'informationItem:graph:deleteSceneInformationConnection',
      {
        id,
      },
    );
  },

  /**
   * シナリオに属するシーン→情報項目の関連を取得
   */
  getSceneInformationConnectionsByScenarioId: async (
    scenarioId: string,
  ): Promise<SceneInformationConnection[]> => {
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:getSceneInformationConnectionsByScenarioId',
      { scenarioId },
    );

    return result;
  },

  /**
   * シナリオに属する情報項目→シーンの関連を取得
   */
  getInformationToSceneConnectionsByScenarioId: async (
    scenarioId: string,
  ): Promise<InformationToSceneConnection[]> => {
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:getInformationToSceneConnectionsByScenarioId',
      { scenarioId },
    );

    return result;
  },

  /**
   * 情報項目に関連するシーンの関連を取得（情報項目→シーン）
   */
  getInformationToSceneConnectionsByInformationItemId: async (
    informationItemId: string,
  ): Promise<InformationToSceneConnection[]> => {
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:getInformationToSceneConnectionsByInformationItemId',
      { informationItemId },
    );

    return result;
  },

  /**
   * 情報項目→シーンの関連を作成
   */
  createInformationToSceneConnection: async (
    connection: Omit<InformationToSceneConnection, 'id'>,
  ): Promise<InformationToSceneConnection> => {
    const id = generateUUID();
    const result = await graphdbWorkerClient.request(
      'informationItem:graph:createInformationToSceneConnection',
      {
        id,
        informationItemId: connection.informationItemId,
        sceneId: connection.sceneId,
      },
    );

    return result;
  },

  /**
   * 情報項目→シーンの関連を削除
   */
  deleteInformationToSceneConnection: async (id: string): Promise<void> => {
    await graphdbWorkerClient.request(
      'informationItem:graph:deleteInformationToSceneConnection',
      {
        id,
      },
    );
  },

  /**
   * データベースを永続化
   */
  save: async () => {
    await graphdbWorkerClient.save();
  },
} as const;
