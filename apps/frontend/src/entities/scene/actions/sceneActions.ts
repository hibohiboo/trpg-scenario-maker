import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Scene, SceneConnection } from '@trpg-scenario-maker/ui';
import { SceneApi } from '../api/sceneApi';

export const readScenesAction = createAsyncThunk<Scene[], string>(
  'scene/readScenes',
  async (scenarioId) => {
    const scenes = await SceneApi.getScenesByScenarioId(scenarioId);
    return scenes;
  },
);

export const readConnectionsAction = createAsyncThunk<SceneConnection[], string>(
  'scene/readConnections',
  async (scenarioId) => {
    const connections = await SceneApi.getConnectionsByScenarioId(scenarioId);
    return connections;
  },
);

export const createSceneAction = createAsyncThunk<
  Scene,
  { scenarioId: string; scene: Omit<Scene, 'id'> }
>('scene/createScene', async ({ scenarioId, scene }) => {
  const newScene = await SceneApi.createScene(scenarioId, scene);
  return newScene;
});

export const updateSceneAction = createAsyncThunk<
  Scene,
  { id: string; updates: Partial<Scene> }
>('scene/updateScene', async ({ id, updates }) => {
  const updatedScene = await SceneApi.updateScene(id, updates);
  return updatedScene;
});

export const deleteSceneAction = createAsyncThunk<string, string>(
  'scene/deleteScene',
  async (id) => {
    await SceneApi.deleteScene(id);
    return id;
  },
);

export const createConnectionAction = createAsyncThunk<
  SceneConnection,
  Omit<SceneConnection, 'id'>
>('scene/createConnection', async (connection) => {
  const newConnection = await SceneApi.createConnection(connection);
  return newConnection;
});

export const deleteConnectionAction = createAsyncThunk<string, string>(
  'scene/deleteConnection',
  async (id) => {
    await SceneApi.deleteConnection(id);
    return id;
  },
);
