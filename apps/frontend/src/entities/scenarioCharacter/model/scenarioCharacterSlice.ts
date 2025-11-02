import { createSelector, createSlice } from '@reduxjs/toolkit';
import type {
  ScenarioCharacter,
  ScenarioCharacterRelationship,
} from '@trpg-scenario-maker/schema';
import {
  addCharacterToScenarioAction,
  removeCharacterFromScenarioAction,
  updateCharacterRoleAction,
  readScenarioCharactersAction,
  createScenarioCharacterRelationAction,
  updateScenarioCharacterRelationAction,
  deleteScenarioCharacterRelationAction,
  readScenarioCharacterRelationsAction,
} from '../actions/scenarioCharacterActions';

export interface ScenarioCharacterState {
  // シナリオ別のキャラクター一覧（キー: scenarioId）
  charactersByScenario: Record<string, ScenarioCharacter[]>;
  // シナリオ別の関係性一覧（キー: scenarioId）
  relationsByScenario: Record<string, ScenarioCharacterRelationship[]>;
  isLoading: boolean;
  isSubmitting: boolean;
}

const initialState: ScenarioCharacterState = {
  charactersByScenario: {},
  relationsByScenario: {},
  isLoading: false,
  isSubmitting: false,
};

export const scenarioCharacterSlice = createSlice({
  name: 'scenarioCharacter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // キャラクター一覧読み込み
    builder
      .addCase(readScenarioCharactersAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(readScenarioCharactersAction.fulfilled, (state, action) => {
        const { scenarioId } = action.meta.arg;
        state.charactersByScenario[scenarioId] = action.payload;
        state.isLoading = false;
      })
      .addCase(readScenarioCharactersAction.rejected, (state) => {
        state.isLoading = false;
      });

    // キャラクター追加
    builder
      .addCase(addCharacterToScenarioAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(addCharacterToScenarioAction.fulfilled, (state, action) => {
        const { scenarioId } = action.payload;
        if (!state.charactersByScenario[scenarioId]) {
          state.charactersByScenario[scenarioId] = [];
        }
        state.charactersByScenario[scenarioId].push(action.payload);
        state.isSubmitting = false;
      })
      .addCase(addCharacterToScenarioAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // キャラクター削除
    builder
      .addCase(removeCharacterFromScenarioAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(removeCharacterFromScenarioAction.fulfilled, (state, action) => {
        const { scenarioId, characterId } = action.payload;
        if (state.charactersByScenario[scenarioId]) {
          state.charactersByScenario[scenarioId] = state.charactersByScenario[
            scenarioId
          ].filter((c) => c.characterId !== characterId);
        }
        state.isSubmitting = false;
      })
      .addCase(removeCharacterFromScenarioAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // 役割更新
    builder
      .addCase(updateCharacterRoleAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateCharacterRoleAction.fulfilled, (state, action) => {
        const { scenarioId, characterId } = action.payload;
        if (state.charactersByScenario[scenarioId]) {
          const index = state.charactersByScenario[scenarioId].findIndex(
            (c) => c.characterId === characterId,
          );
          if (index !== -1) {
            state.charactersByScenario[scenarioId][index] = action.payload;
          }
        }
        state.isSubmitting = false;
      })
      .addCase(updateCharacterRoleAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // 関係性一覧読み込み
    builder
      .addCase(readScenarioCharacterRelationsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        readScenarioCharacterRelationsAction.fulfilled,
        (state, action) => {
          const { scenarioId } = action.meta.arg;
          state.relationsByScenario[scenarioId] = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(readScenarioCharacterRelationsAction.rejected, (state) => {
        state.isLoading = false;
      });

    // 関係性作成
    builder
      .addCase(createScenarioCharacterRelationAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(
        createScenarioCharacterRelationAction.fulfilled,
        (state, action) => {
          const { scenarioId } = action.payload;
          if (!state.relationsByScenario[scenarioId]) {
            state.relationsByScenario[scenarioId] = [];
          }
          state.relationsByScenario[scenarioId].push(action.payload);
          state.isSubmitting = false;
        },
      )
      .addCase(createScenarioCharacterRelationAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // 関係性更新
    builder
      .addCase(updateScenarioCharacterRelationAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(
        updateScenarioCharacterRelationAction.fulfilled,
        (state, action) => {
          const { scenarioId, fromCharacterId, toCharacterId } = action.payload;
          if (state.relationsByScenario[scenarioId]) {
            const index = state.relationsByScenario[scenarioId].findIndex(
              (r) =>
                r.fromCharacterId === fromCharacterId &&
                r.toCharacterId === toCharacterId,
            );
            if (index !== -1) {
              state.relationsByScenario[scenarioId][index] = action.payload;
            }
          }
          state.isSubmitting = false;
        },
      )
      .addCase(updateScenarioCharacterRelationAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // 関係性削除
    builder
      .addCase(deleteScenarioCharacterRelationAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(
        deleteScenarioCharacterRelationAction.fulfilled,
        (state, action) => {
          const { scenarioId, fromCharacterId, toCharacterId } = action.payload;
          if (state.relationsByScenario[scenarioId]) {
            state.relationsByScenario[scenarioId] = state.relationsByScenario[
              scenarioId
            ].filter(
              (r) =>
                !(
                  r.fromCharacterId === fromCharacterId &&
                  r.toCharacterId === toCharacterId
                ),
            );
          }
          state.isSubmitting = false;
        },
      )
      .addCase(deleteScenarioCharacterRelationAction.rejected, (state) => {
        state.isSubmitting = false;
      });
  },
});

export default scenarioCharacterSlice.reducer;

// Selectors
export const scenarioCharactersSelector = createSelector(
  [
    (state: RootState) => state.scenarioCharacter.charactersByScenario,
    (_state: RootState, scenarioId: string) => scenarioId,
  ],
  (charactersByScenario, scenarioId) => charactersByScenario[scenarioId] || [],
);

export const scenarioCharacterRelationsSelector = createSelector(
  [
    (state: RootState) => state.scenarioCharacter.relationsByScenario,
    (_state: RootState, scenarioId: string) => scenarioId,
  ],
  (relationsByScenario, scenarioId) => relationsByScenario[scenarioId] || [],
);

export const scenarioCharacterLoadingSelector = (state: RootState) =>
  state.scenarioCharacter.isLoading;

export const scenarioCharacterSubmittingSelector = (state: RootState) =>
  state.scenarioCharacter.isSubmitting;
