import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { stringToScenario } from '@trpg-scenario-maker/schema';
import type { SerializableScenario } from '@trpg-scenario-maker/schema';
import {
  updateScenarioAction,
  readScenarioAction,
  deleteScenarioAction,
  createScenarioAction,
} from '../actions/scenarioActions';

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
      .addCase(createScenarioAction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // 楽観的UI更新: 作成したシナリオを先頭に追加
        state.scenarios.unshift(action.payload);

        // closeCreateModal
        state.isCreateModalOpen = false;
        state.createTitle = '';
      })
      .addCase(createScenarioAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // Update (更新)
    builder
      .addCase(updateScenarioAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateScenarioAction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // 楽観的UI更新: 更新されたシナリオで置き換え
        const index = state.scenarios.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) {
          state.scenarios[index] = action.payload;
        }
        // closeEditModal
        state.isEditModalOpen = false;
        state.editingScenario = null;
        state.editTitle = '';
      })
      .addCase(updateScenarioAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // Delete (削除)
    builder
      .addCase(deleteScenarioAction.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteScenarioAction.fulfilled, (state, action) => {
        state.isDeleting = false;
        // 楽観的UI更新: 削除されたシナリオを配列から除外
        state.scenarios = state.scenarios.filter(
          (s) => s.id !== action.payload,
        );

        // closeDeleteModal
        state.isDeleteModalOpen = false;
        state.deletingScenario = null;
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

// 複雑な派生状態のみセレクタとして定義
// シンプルな値は各フックで直接アクセスする

const stateSelector = (state: RootState) => state[scenarioSlice.reducerPath];

/**
 * シナリオ一覧のセレクタ（デシリアライズが必要な複雑な変換）
 */
export const scenariosSelector = createSelector(stateSelector, (state) =>
  state.scenarios.map(stringToScenario),
);

/**
 * 編集中のシナリオのセレクタ（デシリアライズが必要な複雑な変換）
 */
export const editingScenarioSelector = createSelector(stateSelector, (state) =>
  state.editingScenario ? stringToScenario(state.editingScenario) : null,
);

/**
 * 削除対象のシナリオのセレクタ（デシリアライズが必要な複雑な変換）
 */
export const deletingScenarioSelector = createSelector(
  stateSelector,
  (state) =>
    state.deletingScenario ? stringToScenario(state.deletingScenario) : null,
);
