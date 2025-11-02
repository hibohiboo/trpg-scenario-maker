import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Relationship } from '@trpg-scenario-maker/schema';
import {
  createRelationshipAction,
  updateRelationshipAction,
  deleteRelationshipAction,
  readRelationshipsByCharacterIdAction,
  readAllRelationshipsAction,
} from '../actions/relationshipActions';

export interface RelationshipState {
  relationships: Relationship[];
  isLoading: boolean;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  createFromCharacterId: string;
  createToCharacterId: string;
  createRelationshipName: string;
  editFromCharacterId: string;
  editToCharacterId: string;
  editRelationshipName: string;
  editingRelationship: Relationship | null;
  deletingRelationship: Relationship | null;
  isSubmitting: boolean;
  isDeleting: boolean;
  selectedCharacterId: string | null;
  outgoingRelationships: Relationship[];
  incomingRelationships: Relationship[];
}

const initialState: RelationshipState = {
  relationships: [],
  isLoading: false,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  createFromCharacterId: '',
  createToCharacterId: '',
  createRelationshipName: '',
  editFromCharacterId: '',
  editToCharacterId: '',
  editRelationshipName: '',
  editingRelationship: null,
  deletingRelationship: null,
  isSubmitting: false,
  isDeleting: false,
  selectedCharacterId: null,
  outgoingRelationships: [],
  incomingRelationships: [],
};

export const relationshipSlice = createSlice({
  name: 'relationship',
  initialState,
  reducers: {
    openCreateModal: (
      state,
      action: PayloadAction<{ fromCharacterId?: string }>,
    ) => {
      state.isCreateModalOpen = true;
      state.createFromCharacterId = action.payload.fromCharacterId || '';
      state.createToCharacterId = '';
      state.createRelationshipName = '';
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
      state.createFromCharacterId = '';
      state.createToCharacterId = '';
      state.createRelationshipName = '';
    },
    setCreateFromCharacterId: (state, action: PayloadAction<string>) => {
      state.createFromCharacterId = action.payload;
    },
    setCreateToCharacterId: (state, action: PayloadAction<string>) => {
      state.createToCharacterId = action.payload;
    },
    setCreateRelationshipName: (state, action: PayloadAction<string>) => {
      state.createRelationshipName = action.payload;
    },
    openEditModal: (state, action: PayloadAction<Relationship>) => {
      state.isEditModalOpen = true;
      state.editingRelationship = action.payload;
      state.editFromCharacterId = action.payload.fromCharacterId;
      state.editToCharacterId = action.payload.toCharacterId;
      state.editRelationshipName = action.payload.relationshipName;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.editingRelationship = null;
      state.editFromCharacterId = '';
      state.editToCharacterId = '';
      state.editRelationshipName = '';
    },
    setEditRelationshipName: (state, action: PayloadAction<string>) => {
      state.editRelationshipName = action.payload;
    },
    openDeleteModal: (state, action: PayloadAction<Relationship>) => {
      state.isDeleteModalOpen = true;
      state.deletingRelationship = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.deletingRelationship = null;
    },
    setSelectedCharacterId: (state, action: PayloadAction<string | null>) => {
      state.selectedCharacterId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Read All (全関係性取得)
    builder
      .addCase(readAllRelationshipsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(readAllRelationshipsAction.fulfilled, (state, action) => {
        state.relationships = action.payload;
        state.isLoading = false;
      })
      .addCase(readAllRelationshipsAction.rejected, (state) => {
        state.isLoading = false;
      });

    // Read By Character ID (キャラクター単位での取得)
    builder
      .addCase(readRelationshipsByCharacterIdAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        readRelationshipsByCharacterIdAction.fulfilled,
        (state, action) => {
          state.outgoingRelationships = action.payload.outgoing;
          state.incomingRelationships = action.payload.incoming;
          state.isLoading = false;
        },
      )
      .addCase(readRelationshipsByCharacterIdAction.rejected, (state) => {
        state.isLoading = false;
      });

    // Create (新規作成)
    builder
      .addCase(createRelationshipAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createRelationshipAction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.relationships.unshift(action.payload);
      })
      .addCase(createRelationshipAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // Update (更新)
    builder
      .addCase(updateRelationshipAction.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateRelationshipAction.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // IDで関係性を特定して更新（同じキャラクターペア間に複数の関係性がある場合に対応）
        const index = state.relationships.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.relationships[index] = action.payload;
        }

        // outgoingRelationships と incomingRelationships も更新
        const outgoingIndex = state.outgoingRelationships.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (outgoingIndex !== -1) {
          state.outgoingRelationships[outgoingIndex] = action.payload;
        }

        const incomingIndex = state.incomingRelationships.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (incomingIndex !== -1) {
          state.incomingRelationships[incomingIndex] = action.payload;
        }
      })
      .addCase(updateRelationshipAction.rejected, (state) => {
        state.isSubmitting = false;
      });

    // Delete (削除)
    builder
      .addCase(deleteRelationshipAction.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteRelationshipAction.fulfilled, (state, action) => {
        state.isDeleting = false;
        // IDで関係性を特定して削除（同じキャラクターペア間に複数の関係性がある場合に対応）
        state.relationships = state.relationships.filter(
          (r) => r.id !== action.payload.id,
        );

        // outgoingRelationships と incomingRelationships からも削除
        state.outgoingRelationships = state.outgoingRelationships.filter(
          (r) => r.id !== action.payload.id,
        );
        state.incomingRelationships = state.incomingRelationships.filter(
          (r) => r.id !== action.payload.id,
        );
      })
      .addCase(deleteRelationshipAction.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});

export const {
  openCreateModal: openRelationshipCreateModal,
  closeCreateModal: closeRelationshipCreateModal,
  setCreateFromCharacterId,
  setCreateToCharacterId,
  setCreateRelationshipName,
  openEditModal: openRelationshipEditModal,
  closeEditModal: closeRelationshipEditModal,
  setEditRelationshipName,
  openDeleteModal: openRelationshipDeleteModal,
  closeDeleteModal: closeRelationshipDeleteModal,
  setSelectedCharacterId,
} = relationshipSlice.actions;

const stateSelector = (state: RootState) =>
  state[relationshipSlice.reducerPath];

export const relationshipsSelector = createSelector(
  stateSelector,
  (state) => state.relationships,
);

export const outgoingRelationshipsSelector = createSelector(
  stateSelector,
  (state) => state.outgoingRelationships,
);

export const incomingRelationshipsSelector = createSelector(
  stateSelector,
  (state) => state.incomingRelationships,
);

export const editingRelationshipSelector = createSelector(
  stateSelector,
  (state) => state.editingRelationship,
);

export const deletingRelationshipSelector = createSelector(
  stateSelector,
  (state) => state.deletingRelationship,
);

export const selectedCharacterIdSelector = createSelector(
  stateSelector,
  (state) => state.selectedCharacterId,
);
