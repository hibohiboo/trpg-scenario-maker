import { createAsyncThunk } from '@reduxjs/toolkit';
import { informationItemGraphApi } from '../api/informationItemGraphApi';
import type {
  InformationItem,
  InformationItemConnection,
  InformationToSceneConnection,
  SceneInformationConnection,
} from '@trpg-scenario-maker/ui';

export const readInformationItemsAction = createAsyncThunk<
  InformationItem[],
  string
>('informationItem/readInformationItems', async (scenarioId) => {
  const items =
    await informationItemGraphApi.getInformationItemsByScenarioId(scenarioId);
  return items;
});

export const createInformationItemAction = createAsyncThunk<
  InformationItem,
  { scenarioId: string; item: Omit<InformationItem, 'id' | 'scenarioId'> }
>('informationItem/createInformationItem', async ({ scenarioId, item }) => {
  const newItem = await informationItemGraphApi.createInformationItem(
    scenarioId,
    item,
  );
  await informationItemGraphApi.save();
  return newItem;
});

export const updateInformationItemAction = createAsyncThunk<
  InformationItem,
  { id: string; updates: Partial<InformationItem> }
>('informationItem/updateInformationItem', async ({ id, updates }) => {
  const updatedItem = await informationItemGraphApi.updateInformationItem(
    id,
    updates,
  );
  await informationItemGraphApi.save();
  return updatedItem;
});

export const deleteInformationItemAction = createAsyncThunk<string, string>(
  'informationItem/deleteInformationItem',
  async (id) => {
    await informationItemGraphApi.deleteInformationItem(id);
    await informationItemGraphApi.save();
    return id;
  },
);

export const readInformationConnectionsAction = createAsyncThunk<
  InformationItemConnection[],
  string
>('informationItem/readInformationConnections', async (scenarioId) => {
  const connections =
    await informationItemGraphApi.getInformationConnectionsByScenarioId(
      scenarioId,
    );
  return connections;
});

export const createInformationConnectionAction = createAsyncThunk<
  InformationItemConnection,
  Omit<InformationItemConnection, 'id'>
>('informationItem/createInformationConnection', async (connection) => {
  const newConnection =
    await informationItemGraphApi.createInformationConnection(connection);
  await informationItemGraphApi.save();
  return newConnection;
});

export const deleteInformationConnectionAction = createAsyncThunk<
  string,
  string
>('informationItem/deleteInformationConnection', async (id) => {
  await informationItemGraphApi.deleteInformationConnection(id);
  await informationItemGraphApi.save();
  return id;
});

export const readSceneInformationConnectionsAction = createAsyncThunk<
  SceneInformationConnection[],
  string
>('informationItem/readSceneInformationConnections', async (sceneId) => {
  const connections =
    await informationItemGraphApi.getSceneInformationConnectionsBySceneId(
      sceneId,
    );
  return connections;
});
export const readInformationToSceneByScenarioIdConnectionsAction =
  createAsyncThunk<SceneInformationConnection[], string>(
    'informationItem/readInformationToSceneByScenarioIdConnectionsAction',
    async (sceneId) => {
      const connections =
        await informationItemGraphApi.getInformationToSceneConnectionsByScenarioId(
          sceneId,
        );
      return connections;
    },
  );

export const readSceneInformationConnectionsByScenarioIdConnectionsAction =
  createAsyncThunk<SceneInformationConnection[], string>(
    'informationItem/readSceneInformationConnectionsByScenarioIdConnectionsAction',
    async (sceneId) => {
      const connections =
        await informationItemGraphApi.getSceneInformationConnectionsByScenarioId(
          sceneId,
        );
      return connections;
    },
  );

export const createSceneInformationConnectionAction = createAsyncThunk<
  SceneInformationConnection,
  Omit<SceneInformationConnection, 'id'>
>('informationItem/createSceneInformationConnection', async (connection) => {
  const newConnection =
    await informationItemGraphApi.createSceneInformationConnection(connection);
  await informationItemGraphApi.save();
  return newConnection;
});

export const deleteSceneInformationConnectionAction = createAsyncThunk<
  string,
  string
>('informationItem/deleteSceneInformationConnection', async (id) => {
  await informationItemGraphApi.deleteSceneInformationConnection(id);
  await informationItemGraphApi.save();
  return id;
});

export const readInformationToSceneConnectionsAction = createAsyncThunk<
  InformationToSceneConnection[],
  string
>(
  'informationItem/readInformationToSceneConnections',
  async (informationItemId) => {
    const connections =
      await informationItemGraphApi.getInformationToSceneConnectionsByInformationItemId(
        informationItemId,
      );
    return connections;
  },
);

export const createInformationToSceneConnectionAction = createAsyncThunk<
  InformationToSceneConnection,
  Omit<InformationToSceneConnection, 'id'>
>('informationItem/createInformationToSceneConnection', async (connection) => {
  const newConnection =
    await informationItemGraphApi.createInformationToSceneConnection(
      connection,
    );
  await informationItemGraphApi.save();
  return newConnection;
});

export const deleteInformationToSceneConnectionAction = createAsyncThunk<
  string,
  string
>('informationItem/deleteInformationToSceneConnection', async (id) => {
  await informationItemGraphApi.deleteInformationToSceneConnection(id);
  await informationItemGraphApi.save();
  return id;
});
