import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Scene, SceneConnection } from '@trpg-scenario-maker/ui';
import { sceneGraphApi } from '../api/sceneGraphApi';

export const readScenesAction = createAsyncThunk<Scene[], string>(
  'scene/readScenes',
  async (scenarioId) => {
    const scenes = await sceneGraphApi.getScenesByScenarioId(scenarioId);
    return scenes;
  },
);

export const readConnectionsAction = createAsyncThunk<SceneConnection[], string>(
  'scene/readConnections',
  async (scenarioId) => {
    const connections =
      await sceneGraphApi.getConnectionsByScenarioId(scenarioId);
    return connections;
  },
);

export const createSceneAction = createAsyncThunk<
  Scene,
  { scenarioId: string; scene: Omit<Scene, 'id'> }
>('scene/createScene', async ({ scenarioId, scene }) => {
  const newScene = await sceneGraphApi.createScene(scenarioId, scene);
  return newScene;
});

export const updateSceneAction = createAsyncThunk<
  Scene,
  { id: string; updates: Partial<Scene> }
>('scene/updateScene', async ({ id, updates }) => {
  const updatedScene = await sceneGraphApi.updateScene(id, updates);
  return updatedScene;
});

export const deleteSceneAction = createAsyncThunk<string, string>(
  'scene/deleteScene',
  async (id) => {
    await sceneGraphApi.deleteScene(id);
    return id;
  },
);

export const createConnectionAction = createAsyncThunk<
  SceneConnection,
  Omit<SceneConnection, 'id'>
>('scene/createConnection', async (connection) => {
  const newConnection = await sceneGraphApi.createConnection(connection);
  return newConnection;
});

export const deleteConnectionAction = createAsyncThunk<string, string>(
  'scene/deleteConnection',
  async (id) => {
    await sceneGraphApi.deleteConnection(id);
    return id;
  },
);
