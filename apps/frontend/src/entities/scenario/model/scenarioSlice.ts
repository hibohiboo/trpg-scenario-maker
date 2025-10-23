import { createSelector, createSlice } from '@reduxjs/toolkit';

export interface ScenarioStatee {
  scenarios: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
const initialState: ScenarioStatee = {
  scenarios: [
    {
      id: '1',
      title: '古城の謎',
      createdAt: new Date('2025-01-15T10:00:00'),
      updatedAt: new Date('2025-01-20T15:30:00'),
    },
  ],
};

export const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {},
});
const stateSelector = (state: RootState) => state[scenarioSlice.reducerPath];

export const scenariosSelector = createSelector(
  stateSelector,
  (c) => c.scenarios ?? [],
);
