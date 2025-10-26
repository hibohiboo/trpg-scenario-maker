import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Scene, SceneConnection } from '@trpg-scenario-maker/ui';
import {
  createSceneAction,
  updateSceneAction,
  deleteSceneAction,
  readScenesAction,
  readConnectionsAction,
  createConnectionAction,
  deleteConnectionAction,
} from '../actions/sceneActions';

export interface SceneState {
  scenes: Scene[];
  connections: SceneConnection[];
  isLoading: boolean;
  error: string | null;
  currentScenarioId: string | null;
  isFormOpen: boolean;
  editingScene: Scene | null;
}

const initialState: SceneState = {
  scenes: [],
  connections: [],
  isLoading: false,
  error: null,
  currentScenarioId: null,
  isFormOpen: false,
  editingScene: null,
};

export const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    setCurrentScenarioId: (state, action: PayloadAction<string>) => {
      state.currentScenarioId = action.payload;
    },
    clearScenes: (state) => {
      state.scenes = [];
      state.connections = [];
      state.currentScenarioId = null;
      state.error = null;
    },
    openSceneForm: (state) => {
      state.isFormOpen = true;
    },
    closeSceneForm: (state) => {
      state.isFormOpen = false;
      state.editingScene = null;
    },
    setEditingScene: (state, action: PayloadAction<Scene>) => {
      state.editingScene = action.payload;
      state.isFormOpen = true;
    },
    clearEditingScene: (state) => {
      state.editingScene = null;
    },
  },
  extraReducers: (builder) => {
    // Read Scenes
    builder
      .addCase(readScenesAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(readScenesAction.fulfilled, (state, action) => {
        state.scenes = action.payload;
        state.isLoading = false;
      })
      .addCase(readScenesAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load scenes';
      });

    // Read Connections
    builder
      .addCase(readConnectionsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(readConnectionsAction.fulfilled, (state, action) => {
        state.connections = action.payload;
        state.isLoading = false;
      })
      .addCase(readConnectionsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load connections';
      });

    // Create Scene
    builder
      .addCase(createSceneAction.pending, (state) => {
        state.error = null;
      })
      .addCase(createSceneAction.fulfilled, (state, action) => {
        state.scenes.push(action.payload);
      })
      .addCase(createSceneAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create scene';
      });

    // Update Scene
    builder
      .addCase(updateSceneAction.pending, (state) => {
        state.error = null;
      })
      .addCase(updateSceneAction.fulfilled, (state, action) => {
        const index = state.scenes.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.scenes[index] = action.payload;
        }
      })
      .addCase(updateSceneAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update scene';
      });

    // Delete Scene
    builder
      .addCase(deleteSceneAction.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteSceneAction.fulfilled, (state, action) => {
        state.scenes = state.scenes.filter((s) => s.id !== action.payload);
        state.connections = state.connections.filter(
          (c) => c.source !== action.payload && c.target !== action.payload,
        );
      })
      .addCase(deleteSceneAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete scene';
      });

    // Create Connection
    builder
      .addCase(createConnectionAction.pending, (state) => {
        state.error = null;
      })
      .addCase(createConnectionAction.fulfilled, (state, action) => {
        state.connections.push(action.payload);
      })
      .addCase(createConnectionAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create connection';
      });

    // Delete Connection
    builder
      .addCase(deleteConnectionAction.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteConnectionAction.fulfilled, (state, action) => {
        state.connections = state.connections.filter(
          (c) => c.id !== action.payload,
        );
      })
      .addCase(deleteConnectionAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete connection';
      });
  },
});

export const {
  setCurrentScenarioId,
  clearScenes,
  openSceneForm,
  closeSceneForm,
  setEditingScene,
  clearEditingScene,
} = sceneSlice.actions;
