import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';
import { characterSlice, relationshipSlice } from '@/entities/character';
import { scenarioSlice } from '@/entities/scenario';
import { scenarioCharacterSlice } from '@/entities/scenarioCharacter';
import { sceneSlice } from '@/entities/scene';
import { sceneEventSlice } from '@/entities/sceneEvent';

const combinedReducer = combineReducers({
  [scenarioSlice.reducerPath]: scenarioSlice.reducer,
  [sceneSlice.reducerPath]: sceneSlice.reducer,
  [sceneEventSlice.reducerPath]: sceneEventSlice.reducer,
  [characterSlice.reducerPath]: characterSlice.reducer,
  [relationshipSlice.reducerPath]: relationshipSlice.reducer,
  [scenarioCharacterSlice.reducerPath]: scenarioCharacterSlice.reducer,
});

type CombinedState = ReturnType<typeof combinedReducer>;

export const rootReducer = (
  state: CombinedState | undefined,
  action: UnknownAction,
) => combinedReducer(state, action);

export type RootReducer = typeof rootReducer;
