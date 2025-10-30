import type { SceneEvent } from '@trpg-scenario-maker/ui';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import type { SceneEventHandlerMap } from '../workers/sceneEventHandlers';

/**
 * シーンイベントのグラフDB操作API
 * GraphDBWorkerClientを使用して、シーンイベント固有のAPI操作を提供
 */
export const sceneEventApi = {
  /**
   * シーンに属するイベントを取得
   */
  getEventsBySceneId: async (sceneId: string): Promise<SceneEvent[]> => {
    const key = 'sceneEvent:graph:getEventsBySceneId';
    const result = await graphdbWorkerClient.request<
      SceneEventHandlerMap[typeof key]
    >(key, { sceneId });

    return result;
  },

  /**
   * イベントを作成
   */
  createEvent: async (
    sceneId: string,
    event: Omit<SceneEvent, 'id'>,
  ): Promise<SceneEvent> => {
    const key = 'sceneEvent:graph:createEvent';
    const id = crypto.randomUUID();

    const result = await graphdbWorkerClient.request<
      SceneEventHandlerMap[typeof key]
    >(key, {
      sceneId,
      id,
      type: event.type,
      content: event.content,
      sortOrder: event.sortOrder,
    });

    return result;
  },

  /**
   * イベントを更新
   */
  updateEvent: async (
    id: string,
    updates: Partial<Omit<SceneEvent, 'id'>>,
  ): Promise<SceneEvent> => {
    const key = 'sceneEvent:graph:updateEvent';
    const result = await graphdbWorkerClient.request<
      SceneEventHandlerMap[typeof key]
    >(key, { id, ...updates });

    return result;
  },

  /**
   * イベントを削除
   */
  deleteEvent: async (id: string): Promise<void> => {
    const key = 'sceneEvent:graph:deleteEvent';
    await graphdbWorkerClient.request<SceneEventHandlerMap[typeof key]>(key, {
      id,
    });
  },

  /**
   * イベントの順序を一括更新
   */
  updateEventOrder: async (
    eventOrders: { id: string; sortOrder: number }[],
  ): Promise<void> => {
    const key = 'sceneEvent:graph:updateEventOrder';
    await graphdbWorkerClient.request<SceneEventHandlerMap[typeof key]>(key, {
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
