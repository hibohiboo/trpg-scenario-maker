import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteScenario } from '@trpg-scenario-maker/rdb';
import { closeDeleteModal } from '../model/scenarioSlice';

export const deleteScenarioAction = createAsyncThunk<
  string,
  { id: string },
  { dispatch: AppDispatch }
>('deleteScenario', async (payload, { dispatch }) => {
  await deleteScenario(payload.id);
  dispatch(closeDeleteModal());
  return payload.id;
});
