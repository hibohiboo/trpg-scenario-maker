import type { SceneEvent } from '@trpg-scenario-maker/ui';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

/**
 * シーンイベントのグラフDB操作API
 * GraphDBWorkerClientを使用して、シーンイベント固有のAPI操作を提供
 */
export const sceneEventApi = {
  /**
   * シーンに属するイベントを取得
   */
  getEventsBySceneId: async (sceneId: string): Promise<SceneEvent[]> => {
    const result = await graphdbWorkerClient.request(
      'sceneEvent:graph:getEventsBySceneId',
      { sceneId },
    );

    return result;
  },

  /**
   * イベントを作成
   */
  createEvent: async (
    sceneId: string,
    event: Omit<SceneEvent, 'id'>,
  ): Promise<SceneEvent> => {
    const id = crypto.randomUUID();

    const result = await graphdbWorkerClient.request(
      'sceneEvent:graph:createEvent',
      {
        sceneId,
        id,
        type: event.type,
        content: event.content,
        sortOrder: event.sortOrder,
      },
    );

    return result;
  },

  /**
   * イベントを更新
   */
  updateEvent: async (
    id: string,
    updates: Partial<Omit<SceneEvent, 'id'>>,
  ): Promise<SceneEvent> => {
    const result = await graphdbWorkerClient.request(
      'sceneEvent:graph:updateEvent',
      { id, ...updates },
    );

    return result;
  },

  /**
   * イベントを削除
   */
  deleteEvent: async (id: string): Promise<void> => {
    await graphdbWorkerClient.request('sceneEvent:graph:deleteEvent', {
      id,
    });
  },

  /**
   * イベントの順序を一括更新
   */
  updateEventOrder: async (
    eventOrders: { id: string; sortOrder: number }[],
  ): Promise<void> => {
    await graphdbWorkerClient.request('sceneEvent:graph:updateEventOrder', {
      eventOrders,
    });
  },

  /**
   * データベースを永続化
   */
  save: async () => {
    await graphdbWorkerClient.save();
  },
} as const;
