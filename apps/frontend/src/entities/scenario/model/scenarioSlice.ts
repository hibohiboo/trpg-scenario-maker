import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { stringToScenario } from '@trpg-scenario-maker/schema';
import type { SerializableScenario } from '@trpg-scenario-maker/schema';
import { createScenarioAction } from '../actions/create';
import { deleteScenarioAction } from '../actions/delete';
import { readScenarioAction } from '../actions/read';
import { updateScenarioAction } from '../actions/update';

export interface ScenarioState {
  scenarios: SerializableScenario[];
  isLoading: boolean;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  createTitle: string;
  editTitle: string;
  editingScenario: SerializableScenario | null;
  deletingScenario: SerializableScenario | null;
  isSubmitting: boolean;
  isDeleting: boolean;
}

const initialState: ScenarioState = {
  scenarios: [],
  isLoading: false,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  createTitle: '',
  editTitle: '',
  editingScenario: null,
  deletingScenario: null,
  isSubmitting: false,
  isDeleting: false,
};

export const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
      state.createTitle = '';
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
      state.createTitle = '';
    },
    setCreateTitle: (state, action: PayloadAction<string>) => {
      state.createTitle = action.payload;
    },
    openEditModal: (state, action: PayloadAction<SerializableScenario>) => {
      state.isEditModalOpen = true;
      state.editingScenario = action.payload;
      state.editTitle = action.payload.title;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.editingScenario = null;
      state.editTitle = '';
    },
    setEditTitle: (state, action: PayloadAction<string>) => {
      state.editTitle = action.payload;
    },
    openDeleteModal: (state, action: PayloadAction<SerializableScenario>) => {
      state.isDeleteModalOpen = true;
      state.deletingScenario = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.deletingScenario = null;
    },
  },
  extraReducers: (builder) => {
    // Read (一覧取得)
    builder
      .addCase(readScenarioAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(readScenarioAction.fulfilled, (state, action) => {
        state.scenarios = action.payload;
        state.isLoading = false;
      })
      .addCase(readScenarioAction.rejected, (state) => {
        state.isLoading = false;
      });

    // Create (新規作成)
    builder
      .addCase(createScenarioAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createScenarioAction.fulfilled, (state) => {
        state.isSubmitting = false;
        // readScenarioActionが後続で呼ばれるため、scenariosの更新はそちらで行う
      })
      .addCase(createScenarioAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // Update (更新)
    builder
      .addCase(updateScenarioAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateScenarioAction.fulfilled, (state) => {
        state.isSubmitting = false;
        // readScenarioActionが後続で呼ばれるため、scenariosの更新はそちらで行う
      })
      .addCase(updateScenarioAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // Delete (削除)
    builder
      .addCase(deleteScenarioAction.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteScenarioAction.fulfilled, (state) => {
        state.isDeleting = false;
        // readScenarioActionが後続で呼ばれるため、scenariosの更新はそちらで行う
      })
      .addCase(deleteScenarioAction.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});
export const {
  openCreateModal,
  closeCreateModal,
  setCreateTitle,
  openEditModal,
  closeEditModal,
  setEditTitle,
  openDeleteModal,
  closeDeleteModal,
} = scenarioSlice.actions;

const stateSelector = (state: RootState) => state[scenarioSlice.reducerPath];

export const scenariosSelector = createSelector(
  stateSelector,
  (c) => c.scenarios.map(stringToScenario) ?? [],
);

export const isLoadingSelector = createSelector(
  stateSelector,
  (c) => c.isLoading,
);

export const isCreateModalOpenSelector = createSelector(
  stateSelector,
  (c) => c.isCreateModalOpen,
);

export const isEditModalOpenSelector = createSelector(
  stateSelector,
  (c) => c.isEditModalOpen,
);

export const isDeleteModalOpenSelector = createSelector(
  stateSelector,
  (c) => c.isDeleteModalOpen,
);

export const createTitleSelector = createSelector(
  stateSelector,
  (c) => c.createTitle,
);

export const editTitleSelector = createSelector(
  stateSelector,
  (c) => c.editTitle,
);

export const editingScenarioSelector = createSelector(stateSelector, (c) =>
  c.editingScenario ? stringToScenario(c.editingScenario) : null,
);

export const deletingScenarioSelector = createSelector(stateSelector, (c) =>
  c.deletingScenario ? stringToScenario(c.deletingScenario) : null,
);

export const isSubmittingSelector = createSelector(
  stateSelector,
  (c) => c.isSubmitting,
);

export const isDeletingSelector = createSelector(
  stateSelector,
  (c) => c.isDeleting,
);
