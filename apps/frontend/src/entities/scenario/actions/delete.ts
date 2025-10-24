import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteScenario } from '@trpg-scenario-maker/rdb';
import { closeDeleteModal } from '../model/scenarioSlice';
import { readScenarioAction } from './read';

export const deleteScenarioAction = createAsyncThunk<
  void,
  { id: string },
  { dispatch: AppDispatch }
>('deleteScenario', async (payload, { dispatch }) => {
  await deleteScenario(payload.id);
  await dispatch(readScenarioAction());
  dispatch(closeDeleteModal());
});
