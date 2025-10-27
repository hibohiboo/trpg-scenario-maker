import type { SceneEvent, SceneEventType } from '@trpg-scenario-maker/schema';
import { useCallback } from 'react';
import { useAppDispatch } from '@/shared/lib/store';
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
  updateEventOrderAction,
  readEventsAction,
} from '../actions/sceneEventActions';

export interface UseSceneEventOperationsResult {
  /**
   * イベントを読み込む
   */
  loadEvents: (sceneId: string) => Promise<void>;

  /**
   * イベントを追加
   */
  addEvent: (
    sceneId: string,
    eventData: { type: SceneEventType; content: string },
  ) => Promise<void>;

  /**
   * イベントを更新
   */
  updateEvent: (
    sceneId: string,
    eventId: string,
    eventData: { type?: SceneEventType; content?: string },
  ) => Promise<void>;

  /**
   * イベントを削除
   */
  removeEvent: (sceneId: string, eventId: string) => Promise<void>;

  /**
   * イベントの順序を変更
   */
  reorderEvents: (
    sceneId: string,
    eventOrders: { id: string; sortOrder: number }[],
  ) => Promise<void>;

  /**
   * イベントを上に移動
   */
  moveEventUp: (sceneId: string, events: SceneEvent[], eventId: string) => Promise<void>;

  /**
   * イベントを下に移動
   */
  moveEventDown: (sceneId: string, events: SceneEvent[], eventId: string) => Promise<void>;
}

/**
 * シーンイベント操作のためのHook
 */
export const useSceneEventOperations = (): UseSceneEventOperationsResult => {
  const dispatch = useAppDispatch();

  const loadEvents = useCallback(
    async (sceneId: string) => {
      await dispatch(readEventsAction(sceneId)).unwrap();
    },
    [dispatch],
  );

  const addEvent = useCallback(
    async (sceneId: string, eventData: { type: SceneEventType; content: string }) => {
      const newEvent = {
        type: eventData.type,
        content: eventData.content,
        sortOrder: 0, // 仮のsortOrder、バックエンドで調整される想定
      };

      await dispatch(
        createEventAction({
          sceneId,
          event: newEvent,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const updateEvent = useCallback(
    async (
      sceneId: string,
      eventId: string,
      eventData: { type?: SceneEventType; content?: string },
    ) => {
      await dispatch(
        updateEventAction({
          sceneId,
          id: eventId,
          updates: eventData,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const removeEvent = useCallback(
    async (sceneId: string, eventId: string) => {
      await dispatch(
        deleteEventAction({
          sceneId,
          eventId,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const reorderEvents = useCallback(
    async (sceneId: string, eventOrders: { id: string; sortOrder: number }[]) => {
      await dispatch(
        updateEventOrderAction({
          sceneId,
          eventOrders,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const moveEventUp = useCallback(
    async (sceneId: string, events: SceneEvent[], eventId: string) => {
      const currentIndex = events.findIndex((e) => e.id === eventId);
      if (currentIndex <= 0) return; // 既に先頭

      // 順序を入れ替え
      const newOrders = events.map((event, index) => {
        if (index === currentIndex - 1) {
          return { id: event.id, sortOrder: currentIndex };
        }
        if (index === currentIndex) {
          return { id: event.id, sortOrder: currentIndex - 1 };
        }
        return { id: event.id, sortOrder: index };
      });

      await reorderEvents(sceneId, newOrders);
    },
    [dispatch, reorderEvents],
  );

  const moveEventDown = useCallback(
    async (sceneId: string, events: SceneEvent[], eventId: string) => {
      const currentIndex = events.findIndex((e) => e.id === eventId);
      if (currentIndex === -1 || currentIndex >= events.length - 1) return; // 既に最後

      // 順序を入れ替え
      const newOrders = events.map((event, index) => {
        if (index === currentIndex) {
          return { id: event.id, sortOrder: currentIndex + 1 };
        }
        if (index === currentIndex + 1) {
          return { id: event.id, sortOrder: currentIndex };
        }
        return { id: event.id, sortOrder: index };
      });

      await reorderEvents(sceneId, newOrders);
    },
    [dispatch, reorderEvents],
  );

  return {
    loadEvents,
    addEvent,
    updateEvent,
    removeEvent,
    reorderEvents,
    moveEventUp,
    moveEventDown,
  };
};
