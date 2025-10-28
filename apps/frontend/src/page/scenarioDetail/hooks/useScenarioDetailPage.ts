import type { SceneEventType } from '@trpg-scenario-maker/ui';
import { useParams } from 'react-router';
import { scenarioGraphApi } from '@/entities/scenario';
import {
  useSceneList,
  useSceneOperations,
  useSceneFormState,
} from '@/entities/scene';
import {
  useSceneEventOperations,
  sceneEventSlice,
} from '@/entities/sceneEvent';
import { useAppSelector } from '@/shared/lib/store';

export const useScenarioDetailPage = () => {
  const { id } = useParams();
  if (!id) throw new Error('シナリオIDが見つかりません');

  const { scenes, connections, isLoading, error } = useSceneList();
  const {
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
  } = useSceneOperations();
  const {
    isFormOpen,
    editingScene,
    handleOpenForm,
    handleCloseForm,
    handleEditScene,
  } = useSceneFormState();
  const { addEvent, updateEvent, removeEvent, moveEventUp, moveEventDown } =
    useSceneEventOperations();
  const events = useAppSelector(
    (state) => state[sceneEventSlice.reducerPath].eventsBySceneId,
  );

  const handleSave = async () => {
    await scenarioGraphApi.save();
    alert('シナリオを保存しました');
  };

  const handleAddEvent = async (
    sceneId: string,
    eventData: { type: SceneEventType; content: string },
  ) => {
    await addEvent(sceneId, eventData);
  };

  const handleUpdateEvent = async (
    sceneId: string,
    eventId: string,
    eventData: { type: SceneEventType; content: string },
  ) => {
    await updateEvent(sceneId, eventId, eventData);
  };

  const handleDeleteEvent = async (sceneId: string, eventId: string) => {
    await removeEvent(sceneId, eventId);
  };

  const handleMoveEventUp = async (sceneId: string, eventId: string) => {
    const sceneEvents = events[sceneId] || [];
    await moveEventUp(sceneId, sceneEvents, eventId);
  };

  const handleMoveEventDown = async (sceneId: string, eventId: string) => {
    const sceneEvents = events[sceneId] || [];
    await moveEventDown(sceneId, sceneEvents, eventId);
  };

  return {
    id,
    scenes,
    connections,
    events,
    isLoading,
    error,
    isFormOpen,
    editingScene,
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleMoveEventUp,
    handleMoveEventDown,
    handleOpenForm,
    handleCloseForm,
    handleEditScene,
    handleSave,
  };
};
