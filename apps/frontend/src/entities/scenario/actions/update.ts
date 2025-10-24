import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateScenario } from '@trpg-scenario-maker/rdb';
import { closeEditModal } from '../model/scenarioSlice';
import { readScenarioAction } from './read';

export const updateScenarioAction = createAsyncThunk<
  void,
  { id: string; title: string },
  { dispatch: AppDispatch }
>('updateScenario', async (payload, { dispatch }) => {
  await updateScenario(payload.id, { title: payload.title });
  await dispatch(readScenarioAction());
  dispatch(closeEditModal());
});
