import { createAsyncThunk } from '@reduxjs/toolkit';
import { sceneEventApi } from '../api/sceneEventApi';
import type { SceneEvent } from '@trpg-scenario-maker/ui';

/**
 * シーンに属するイベントを読み込む
 */
export const readEventsAction = createAsyncThunk(
  'sceneEvent/readEvents',
  async (sceneId: string) => {
    const events = await sceneEventApi.getEventsBySceneId(sceneId);
    return { sceneId, events };
  },
);

/**
 * イベントを作成
 */
export const createEventAction = createAsyncThunk(
  'sceneEvent/createEvent',
  async (params: { sceneId: string; event: Omit<SceneEvent, 'id'> }) => {
    const event = await sceneEventApi.createEvent(params.sceneId, params.event);
    await sceneEventApi.save();
    return { sceneId: params.sceneId, event };
  },
);

/**
 * イベントを更新
 */
export const updateEventAction = createAsyncThunk(
  'sceneEvent/updateEvent',
  async (params: {
    sceneId: string;
    id: string;
    updates: Partial<Omit<SceneEvent, 'id'>>;
  }) => {
    const event = await sceneEventApi.updateEvent(params.id, params.updates);
    await sceneEventApi.save();
    return { sceneId: params.sceneId, event };
  },
);

/**
 * イベントを削除
 */
export const deleteEventAction = createAsyncThunk(
  'sceneEvent/deleteEvent',
  async (params: { sceneId: string; eventId: string }) => {
    await sceneEventApi.deleteEvent(params.eventId);
    await sceneEventApi.save();
    return { sceneId: params.sceneId, eventId: params.eventId };
  },
);

/**
 * イベントの順序を一括更新
 */
export const updateEventOrderAction = createAsyncThunk(
  'sceneEvent/updateEventOrder',
  async (params: {
    sceneId: string;
    eventOrders: { id: string; sortOrder: number }[];
  }) => {
    await sceneEventApi.updateEventOrder(params.eventOrders);
    await sceneEventApi.save();
    return params;
  },
);
