import type { Scene, SceneEventType } from './types';

const createHandler = <T extends unknown[]>(
  sceneId: string,
  handler?: (sceneId: string, ...args: T) => void,
) => (handler ? (...args: T) => handler(sceneId, ...args) : undefined);

export const createEventHandlers = (
  editingScene: Scene | null,
  onAddEvent?: (
    sceneId: string,
    eventData: { type: SceneEventType; content: string },
  ) => void,
  onUpdateEvent?: (
    sceneId: string,
    eventId: string,
    eventData: { type: SceneEventType; content: string },
  ) => void,
  onDeleteEvent?: (sceneId: string, eventId: string) => void,
  onMoveEventUp?: (sceneId: string, eventId: string) => void,
  onMoveEventDown?: (sceneId: string, eventId: string) => void,
) => {
  if (!editingScene) {
    return {
      handleAddEvent: undefined,
      handleUpdateEvent: undefined,
      handleDeleteEvent: undefined,
      handleMoveEventUp: undefined,
      handleMoveEventDown: undefined,
    };
  }

  const sceneId = editingScene.id;

  return {
    handleAddEvent: createHandler(sceneId, onAddEvent),
    handleUpdateEvent: createHandler(sceneId, onUpdateEvent),
    handleDeleteEvent: createHandler(sceneId, onDeleteEvent),
    handleMoveEventUp: createHandler(sceneId, onMoveEventUp),
    handleMoveEventDown: createHandler(sceneId, onMoveEventDown),
  };
};
