import { createAsyncThunk } from '@reduxjs/toolkit';
import { getScenarioCount, getScenarios } from '@trpg-scenario-maker/rdb';
import {
  scenarioToString,
  type SerializableScenario,
} from '@trpg-scenario-maker/schema';

export const readScenarioAction = createAsyncThunk<
  SerializableScenario[],
  void
>('readScenario', async (_) => {
  const scenarios = await getScenarios();
  return scenarios.map(scenarioToString);
});

export const getCountSample = async () => {
  const cnt = await getScenarioCount();
  return cnt;
};
