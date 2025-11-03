import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ScenarioDetailState {
  tabItems: string[];
  currentTab: string;
}

const initialState: ScenarioDetailState = {
  tabItems: ['シーン', 'キャラクター', '情報項目'],
  currentTab: 'シーン',
};

export const scenarioDetailSlice = createSlice({
  name: 'scenarioDetail',
  initialState,
  reducers: {
    setScenarioDetailCurrentTab: (state, action: PayloadAction<string>) => {
      state.currentTab = action.payload;
    },
  },
});
export const { setScenarioDetailCurrentTab } = scenarioDetailSlice.actions;
export const scenarioDetailCurrentTabSelector = (state: RootState) =>
  state.scenarioDetail.currentTab;
export const scenarioDetailTabItemsSelector = (state: RootState) =>
  state.scenarioDetail.tabItems;
