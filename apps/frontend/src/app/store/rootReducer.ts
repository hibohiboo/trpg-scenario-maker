import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';
import { scenarioSlice } from '@/entities/scenario';

const combinedReducer = combineReducers({
  [scenarioSlice.reducerPath]: scenarioSlice.reducer,
});

type CombinedState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: CombinedState | undefined,
  action: UnknownAction,
) => combinedReducer(state, action);

export type RootReducer = typeof rootReducer;
