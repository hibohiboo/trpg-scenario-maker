import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SceneEvent } from '@trpg-scenario-maker/ui';
import {
  readEventsAction,
  createEventAction,
  updateEventAction,
  deleteEventAction,
  updateEventOrderAction,
} from '../actions/sceneEventActions';

export interface SceneEventState {
  eventsBySceneId: Record<string, SceneEvent[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: SceneEventState = {
  eventsBySceneId: {},
  isLoading: false,
  error: null,
};

/**
 * Comparator function to sort events by sortOrder in ascending order
 */
const compareBySortOrder = (a: SceneEvent, b: SceneEvent): number =>
  a.sortOrder - b.sortOrder;

export const sceneEventSlice = createSlice({
  name: 'sceneEvent',
  initialState,
  reducers: {
    clearEvents: (state, action: PayloadAction<string>) => {
      delete state.eventsBySceneId[action.payload];
      state.error = null;
    },
    clearAllEvents: (state) => {
      state.eventsBySceneId = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Read Events
    builder
      .addCase(readEventsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(readEventsAction.fulfilled, (state, action) => {
        const { sceneId, events } = action.payload;
        state.eventsBySceneId[sceneId] = events;
        state.isLoading = false;
      })
      .addCase(readEventsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load events';
      });

    // Create Event
    builder
      .addCase(createEventAction.pending, (state) => {
        state.error = null;
      })
      .addCase(createEventAction.fulfilled, (state, action) => {
        const { sceneId, event } = action.payload;
        if (!state.eventsBySceneId[sceneId]) {
          state.eventsBySceneId[sceneId] = [];
        }
        state.eventsBySceneId[sceneId].push(event);
        state.eventsBySceneId[sceneId].sort(compareBySortOrder);
      })
      .addCase(createEventAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create event';
      });

    // Update Event
    builder
      .addCase(updateEventAction.pending, (state) => {
        state.error = null;
      })
      .addCase(updateEventAction.fulfilled, (state, action) => {
        const { sceneId, event } = action.payload;
        const events = state.eventsBySceneId[sceneId];
        if (events) {
          const index = events.findIndex((e) => e.id === event.id);
          if (index !== -1) {
            events[index] = event;
            events.sort(compareBySortOrder);
          }
        }
      })
      .addCase(updateEventAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update event';
      });

    // Delete Event
    builder
      .addCase(deleteEventAction.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteEventAction.fulfilled, (state, action) => {
        const { sceneId, eventId } = action.payload;
        const events = state.eventsBySceneId[sceneId];
        if (events) {
          state.eventsBySceneId[sceneId] = events.filter(
            (e) => e.id !== eventId,
          );
        }
      })
      .addCase(deleteEventAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete event';
      });

    // Update Event Order
    builder
      .addCase(updateEventOrderAction.pending, (state) => {
        state.error = null;
      })
      .addCase(updateEventOrderAction.fulfilled, (state, action) => {
        const { sceneId, eventOrders } = action.payload;
        const events = state.eventsBySceneId[sceneId];
        if (events) {
          // Update sortOrders
          eventOrders.forEach(({ id, sortOrder }) => {
            const event = events.find((e) => e.id === id);
            if (event) {
              event.sortOrder = sortOrder;
            }
          });
          events.sort(compareBySortOrder);
        }
      })
      .addCase(updateEventOrderAction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update event order';
      });
  },
});

export const { clearEvents, clearAllEvents } = sceneEventSlice.actions;
export default sceneEventSlice.reducer;
