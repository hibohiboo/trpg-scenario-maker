import { createSelector, createSlice } from '@reduxjs/toolkit';
import {
  createCharacterAction,
  updateCharacterAction,
  deleteCharacterAction,
  readCharacterListAction,
} from '../actions/characterActions';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '@trpg-scenario-maker/schema';

export interface CharacterState {
  characters: Character[];
  isLoading: boolean;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  createName: string;
  createDescription: string;
  editName: string;
  editDescription: string;
  editingCharacter: Character | null;
  deletingCharacter: Character | null;
  isSubmitting: boolean;
  isDeleting: boolean;
}

const initialState: CharacterState = {
  characters: [],
  isLoading: false,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  createName: '',
  createDescription: '',
  editName: '',
  editDescription: '',
  editingCharacter: null,
  deletingCharacter: null,
  isSubmitting: false,
  isDeleting: false,
};

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
      state.createName = '';
      state.createDescription = '';
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
      state.createName = '';
      state.createDescription = '';
    },
    setCreateName: (state, action: PayloadAction<string>) => {
      state.createName = action.payload;
    },
    setCreateDescription: (state, action: PayloadAction<string>) => {
      state.createDescription = action.payload;
    },
    openEditModal: (state, action: PayloadAction<Character>) => {
      state.isEditModalOpen = true;
      state.editingCharacter = action.payload;
      state.editName = action.payload.name;
      state.editDescription = action.payload.description;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.editingCharacter = null;
      state.editName = '';
      state.editDescription = '';
    },
    setEditName: (state, action: PayloadAction<string>) => {
      state.editName = action.payload;
    },
    setEditDescription: (state, action: PayloadAction<string>) => {
      state.editDescription = action.payload;
    },
    openDeleteModal: (state, action: PayloadAction<Character>) => {
      state.isDeleteModalOpen = true;
      state.deletingCharacter = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.deletingCharacter = null;
    },
  },
  extraReducers: (builder) => {
    // Read (一覧取得)
    builder
      .addCase(readCharacterListAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(readCharacterListAction.fulfilled, (state, action) => {
        state.characters = action.payload;
        state.isLoading = false;
      })
      .addCase(readCharacterListAction.rejected, (state) => {
        state.isLoading = false;
      });

    // Create (新規作成)
    builder
      .addCase(createCharacterAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createCharacterAction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.characters.unshift(action.payload);
        // closeCreateModal
        state.isCreateModalOpen = false;
        state.createName = '';
        state.createDescription = '';
      })
      .addCase(createCharacterAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // Update (更新)
    builder
      .addCase(updateCharacterAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateCharacterAction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.characters.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.characters[index] = action.payload;
        }

        // closeEditModal
        state.isEditModalOpen = false;
        state.editingCharacter = null;
        state.editName = '';
        state.editDescription = '';
      })
      .addCase(updateCharacterAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // Delete (削除)
    builder
      .addCase(deleteCharacterAction.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteCharacterAction.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.characters = state.characters.filter(
          (c) => c.id !== action.payload,
        );
        // closeDeleteModal
        state.isDeleteModalOpen = false;
        state.deletingCharacter = null;
      })
      .addCase(deleteCharacterAction.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});

export const {
  openCreateModal,
  closeCreateModal,
  setCreateName,
  setCreateDescription,
  openEditModal,
  closeEditModal,
  setEditName,
  setEditDescription,
  openDeleteModal,
  closeDeleteModal,
} = characterSlice.actions;

const stateSelector = (state: RootState) => state[characterSlice.reducerPath];

export const charactersSelector = createSelector(
  stateSelector,
  (state) => state.characters,
);

export const editingCharacterSelector = createSelector(
  stateSelector,
  (state) => state.editingCharacter,
);

export const deletingCharacterSelector = createSelector(
  stateSelector,
  (state) => state.deletingCharacter,
);
