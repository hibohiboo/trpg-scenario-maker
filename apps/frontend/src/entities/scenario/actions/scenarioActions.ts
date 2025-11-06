import { createAsyncThunk } from '@reduxjs/toolkit';
import { type SerializableScenario } from '@trpg-scenario-maker/schema';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { scenarioApi } from '../api/scenarioApi';
import { scenarioGraphApi } from '../api/scenarioGraphApi';
import {
  closeCreateModal,
  closeDeleteModal,
  closeEditModal,
} from '../model/scenarioSlice';

export const createScenarioAction = createAsyncThunk<
  SerializableScenario,
  { title: string },
  { dispatch: AppDispatch }
>('createScenario', async (payload, { dispatch }) => {
  const newScenario = await scenarioApi.create({
    title: payload.title,
    id: generateUUID(),
  });
  await scenarioGraphApi.create(newScenario);
  await scenarioGraphApi.save();
  dispatch(closeCreateModal());
  return newScenario;
});
export const updateScenarioAction = createAsyncThunk<
  SerializableScenario,
  { id: string; title: string },
  { dispatch: AppDispatch }
>('updateScenario', async (payload, { dispatch }) => {
  const updatedScenario = await scenarioApi.update(payload.id, {
    title: payload.title,
  });
  dispatch(closeEditModal());
  return updatedScenario;
});
export const deleteScenarioAction = createAsyncThunk<
  string,
  { id: string },
  { dispatch: AppDispatch }
>('deleteScenario', async (payload, { dispatch }) => {
  await scenarioApi.delete(payload.id);
  dispatch(closeDeleteModal());
  return payload.id;
});
export const readScenarioAction = createAsyncThunk<
  SerializableScenario[],
  void
>('readScenario', async (_) => {
  const scenarios = await scenarioApi.getList();
  return scenarios;
});

export const getCountSample = async () => {
  const cnt = await scenarioApi.getCount();
  return cnt;
};
