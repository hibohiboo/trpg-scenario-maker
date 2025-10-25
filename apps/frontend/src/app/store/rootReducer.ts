import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';
import { scenarioSlice } from '@/entities/scenario';
import { sceneSlice } from '@/entities/scene';

const combinedReducer = combineReducers({
  [scenarioSlice.reducerPath]: scenarioSlice.reducer,
  [sceneSlice.reducerPath]: sceneSlice.reducer,
});

type CombinedState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: CombinedState | undefined,
  action: UnknownAction,
) => combinedReducer(state, action);

export type RootReducer = typeof rootReducer;
