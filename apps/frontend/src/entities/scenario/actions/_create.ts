import { createAsyncThunk } from '@reduxjs/toolkit';
import { createScenario } from '@trpg-scenario-maker/rdb';
import {
  scenarioToString,
  type SerializableScenario,
} from '@trpg-scenario-maker/schema';
import { v4 as uuidv4 } from 'uuid';
import { closeCreateModal } from '../model/scenarioSlice';

export const createScenarioAction = createAsyncThunk<
  SerializableScenario,
  { title: string },
  { dispatch: AppDispatch }
>('createScenario', async (payload, { dispatch }) => {
  const newScenario = await createScenario({
    title: payload.title,
    id: uuidv4(),
  });
  dispatch(closeCreateModal());
  return scenarioToString(newScenario);
});
