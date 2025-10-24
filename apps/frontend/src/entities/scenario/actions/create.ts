import { createAsyncThunk } from '@reduxjs/toolkit';
import { createScenario } from '@trpg-scenario-maker/rdb/queries/insert';
import { v4 as uuidv4 } from 'uuid';
import { closeCreateModal } from '../model/scenarioSlice';
import { readScenarioAction } from './read';

export const createScenarioAction = createAsyncThunk<
  void,
  { title: string },
  { dispatch: AppDispatch }
>('createScenario', async (payload, { dispatch }) => {
  await createScenario({
    title: payload.title,
    id: uuidv4(),
  });
  await dispatch(readScenarioAction());
  dispatch(closeCreateModal());
});
