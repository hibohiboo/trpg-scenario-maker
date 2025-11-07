import { createSlice } from '@reduxjs/toolkit';
import {
  createInformationConnectionAction,
  createInformationItemAction,
  createInformationToSceneConnectionAction,
  createSceneInformationConnectionAction,
  deleteInformationConnectionAction,
  deleteInformationItemAction,
  deleteInformationToSceneConnectionAction,
  deleteSceneInformationConnectionAction,
  readInformationConnectionsAction,
  readInformationItemsAction,
  readInformationToSceneByScenarioIdConnectionsAction,
  readInformationToSceneConnectionsAction,
  readSceneInformationConnectionsAction,
  readSceneInformationConnectionsByScenarioIdConnectionsAction,
  updateInformationItemAction,
} from '../actions/informationItemActions';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  InformationItem,
  InformationItemConnection,
  InformationToSceneConnection,
  SceneInformationConnection,
} from '@trpg-scenario-maker/ui';

export interface InformationItemState {
  items: InformationItem[];
  informationConnections: InformationItemConnection[];
  sceneInformationConnections: SceneInformationConnection[];
  informationToSceneConnections: InformationToSceneConnection[];
  isLoading: boolean;
  error: string | null;
  currentScenarioId: string | null;
  isFormOpen: boolean;
  editingItem: InformationItem | null;
}

const initialState: InformationItemState = {
  items: [],
  informationConnections: [],
  sceneInformationConnections: [],
  informationToSceneConnections: [],
  isLoading: false,
  error: null,
  currentScenarioId: null,
  isFormOpen: false,
  editingItem: null,
};

export const informationItemSlice = createSlice({
  name: 'informationItem',
  initialState,
  reducers: {
    setCurrentScenarioId: (state, action: PayloadAction<string>) => {
      state.currentScenarioId = action.payload;
    },
    clearInformationItems: (state) => {
      state.items = [];
      state.informationConnections = [];
      state.sceneInformationConnections = [];
      state.informationToSceneConnections = [];
      state.currentScenarioId = null;
      state.error = null;
    },
    openInformationItemForm: (state) => {
      state.isFormOpen = true;
    },
    closeInformationItemForm: (state) => {
      state.isFormOpen = false;
      state.editingItem = null;
    },
    setEditingItem: (state, action: PayloadAction<InformationItem>) => {
      state.editingItem = action.payload;
      state.isFormOpen = true;
    },
    clearEditingItem: (state) => {
      state.editingItem = null;
    },
  },
  extraReducers: (builder) => {
    // Read Information Items
    builder
      .addCase(readInformationItemsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(readInformationItemsAction.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(readInformationItemsAction.rejected, (state, action) => {
        state.isLoading = false;
        console.warn(action.type, action);
        state.error =
          action.error.message || 'Failed to load information items';
      });

    // Create Information Item
    builder
      .addCase(createInformationItemAction.pending, (state) => {
        state.error = null;
      })
      .addCase(createInformationItemAction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createInformationItemAction.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to create information item';
      });

    // Update Information Item
    builder
      .addCase(updateInformationItemAction.pending, (state) => {
        state.error = null;
      })
      .addCase(updateInformationItemAction.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateInformationItemAction.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to update information item';
      });

    // Delete Information Item
    builder
      .addCase(deleteInformationItemAction.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteInformationItemAction.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.informationConnections = state.informationConnections.filter(
          (c) => c.source !== action.payload && c.target !== action.payload,
        );
        state.sceneInformationConnections =
          state.sceneInformationConnections.filter(
            (c) => c.informationItemId !== action.payload,
          );
        state.informationToSceneConnections =
          state.informationToSceneConnections.filter(
            (c) => c.informationItemId !== action.payload,
          );
      })
      .addCase(deleteInformationItemAction.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to delete information item';
      });

    // Read Information Connections
    builder
      .addCase(readInformationConnectionsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(readInformationConnectionsAction.fulfilled, (state, action) => {
        state.informationConnections = action.payload;
        state.isLoading = false;
      })
      .addCase(readInformationConnectionsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Failed to load information connections';
      });

    // Create Information Connection
    builder
      .addCase(createInformationConnectionAction.pending, (state) => {
        state.error = null;
      })
      .addCase(createInformationConnectionAction.fulfilled, (state, action) => {
        state.informationConnections.push(action.payload);
      })
      .addCase(createInformationConnectionAction.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to create information connection';
      });

    // Delete Information Connection
    builder
      .addCase(deleteInformationConnectionAction.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteInformationConnectionAction.fulfilled, (state, action) => {
        state.informationConnections = state.informationConnections.filter(
          (c) => c.id !== action.payload,
        );
      })
      .addCase(deleteInformationConnectionAction.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to delete information connection';
      });

    // Read Scene Information Connections
    builder
      .addCase(readSceneInformationConnectionsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        readSceneInformationConnectionsAction.fulfilled,
        (state, action) => {
          state.sceneInformationConnections = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(
        readSceneInformationConnectionsAction.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message ||
            'Failed to load scene information connections';
        },
      );
    builder
      .addCase(
        readSceneInformationConnectionsByScenarioIdConnectionsAction.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addCase(
        readSceneInformationConnectionsByScenarioIdConnectionsAction.fulfilled,
        (state, action) => {
          state.sceneInformationConnections = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(
        readSceneInformationConnectionsByScenarioIdConnectionsAction.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message ||
            'Failed to load scene information connections by scenarioId';
        },
      );
    // Create Scene Information Connection
    builder
      .addCase(createSceneInformationConnectionAction.pending, (state) => {
        state.error = null;
      })
      .addCase(
        createSceneInformationConnectionAction.fulfilled,
        (state, action) => {
          state.sceneInformationConnections.push(action.payload);
        },
      )
      .addCase(
        createSceneInformationConnectionAction.rejected,
        (state, action) => {
          state.error =
            action.error.message ||
            'Failed to create scene information connection';
        },
      );

    // Delete Scene Information Connection
    builder
      .addCase(deleteSceneInformationConnectionAction.pending, (state) => {
        state.error = null;
      })
      .addCase(
        deleteSceneInformationConnectionAction.fulfilled,
        (state, action) => {
          state.sceneInformationConnections =
            state.sceneInformationConnections.filter(
              (c) => c.id !== action.payload,
            );
        },
      )
      .addCase(
        deleteSceneInformationConnectionAction.rejected,
        (state, action) => {
          state.error =
            action.error.message ||
            'Failed to delete scene information connection';
        },
      );

    // Read Information To Scene Connections
    builder
      .addCase(readInformationToSceneConnectionsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        readInformationToSceneConnectionsAction.fulfilled,
        (state, action) => {
          state.informationToSceneConnections = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(
        readInformationToSceneConnectionsAction.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message ||
            'Failed to load information to scene connections';
        },
      );
    builder
      .addCase(
        readInformationToSceneByScenarioIdConnectionsAction.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addCase(
        readInformationToSceneByScenarioIdConnectionsAction.fulfilled,
        (state, action) => {
          state.informationToSceneConnections = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(
        readInformationToSceneByScenarioIdConnectionsAction.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message ||
            'Failed to load information to scene connections by scenarioId';
        },
      );
    // Create Information To Scene Connection
    builder
      .addCase(createInformationToSceneConnectionAction.pending, (state) => {
        state.error = null;
      })
      .addCase(
        createInformationToSceneConnectionAction.fulfilled,
        (state, action) => {
          state.informationToSceneConnections.push(action.payload);
        },
      )
      .addCase(
        createInformationToSceneConnectionAction.rejected,
        (state, action) => {
          state.error =
            action.error.message ||
            'Failed to create information to scene connection';
        },
      );

    // Delete Information To Scene Connection
    builder
      .addCase(deleteInformationToSceneConnectionAction.pending, (state) => {
        state.error = null;
      })
      .addCase(
        deleteInformationToSceneConnectionAction.fulfilled,
        (state, action) => {
          state.informationToSceneConnections =
            state.informationToSceneConnections.filter(
              (c) => c.id !== action.payload,
            );
        },
      )
      .addCase(
        deleteInformationToSceneConnectionAction.rejected,
        (state, action) => {
          state.error =
            action.error.message ||
            'Failed to delete information to scene connection';
        },
      );
  },
});

export const {
  setCurrentScenarioId,
  clearInformationItems,
  openInformationItemForm,
  closeInformationItemForm,
  setEditingItem,
  clearEditingItem,
} = informationItemSlice.actions;
