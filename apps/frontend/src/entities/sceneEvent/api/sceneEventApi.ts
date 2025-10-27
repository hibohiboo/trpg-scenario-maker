import { parseSceneEventSchema } from '@trpg-scenario-maker/schema/sceneEvent';
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
    const result = await graphdbWorkerClient.request<SceneEvent[]>(
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
    const result = await graphdbWorkerClient.request<SceneEvent[]>(
      'sceneEvent:graph:createEvent',
      {
        sceneId,
        id,
        type: event.type,
        content: event.content,
        sortOrder: event.sortOrder,
      },
    );

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error(
        'Failed to create event: No result returned from database',
      );
    }

    return parseSceneEventSchema(result[0]);
  },

  /**
   * イベントを更新
   */
  updateEvent: async (
    id: string,
    updates: Partial<Omit<SceneEvent, 'id'>>,
  ): Promise<SceneEvent> => {
    const result = await graphdbWorkerClient.request<SceneEvent[]>(
      'sceneEvent:graph:updateEvent',
      {
        id,
        ...updates,
      },
    );

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error(
        'Failed to update event: Event not found or no result returned',
      );
    }

    return parseSceneEventSchema(result[0]);
  },

  /**
   * イベントを削除
   */
  deleteEvent: async (id: string): Promise<void> => {
    await graphdbWorkerClient.request('sceneEvent:graph:deleteEvent', { id });
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
