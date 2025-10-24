import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateScenario } from '@trpg-scenario-maker/rdb';
import {
  scenarioToString,
  type SerializableScenario,
} from '@trpg-scenario-maker/schema';
import { closeEditModal } from '../model/scenarioSlice';

export const updateScenarioAction = createAsyncThunk<
  SerializableScenario,
  { id: string; title: string },
  { dispatch: AppDispatch }
>('updateScenario', async (payload, { dispatch }) => {
  const updatedScenario = await updateScenario(payload.id, {
    title: payload.title,
  });
  dispatch(closeEditModal());
  return scenarioToString(updatedScenario);
});
