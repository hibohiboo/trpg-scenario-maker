import type { SceneEventType, CharacterWithRole } from '@trpg-scenario-maker/ui';
import { useParams } from 'react-router';
import { scenarioGraphApi } from '@/entities/scenario';
import { useScenarioCharacterList } from '@/entities/scenarioCharacter';
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
    handleDeleteScene: _handleDeleteScene,
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

  const {
    characters,
    isLoading: isCharactersLoading,
    removeCharacter,
  } = useScenarioCharacterList(id);

  const handleSave = async () => {
    await scenarioGraphApi.save();
    alert('シナリオを保存しました');
  };

  const handleDeleteScene = async (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;

    const confirmed = window.confirm(
      `シーン「${scene.title}」を削除してもよろしいですか？\nこの操作は取り消せません。`,
    );
    if (confirmed) {
      await _handleDeleteScene(sceneId);
    }
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

  const handleCharacterClick = (character: CharacterWithRole) => {
    // TODO: キャラクター詳細ページへ遷移、または編集モーダルを開く
    console.log('Character clicked:', character);
  };

  const handleRemoveCharacter = async (characterId: string) => {
    const character = characters.find((c) => c.characterId === characterId);
    if (!character) return;

    const confirmed = window.confirm(
      `キャラクター「${character.name}」をシナリオから削除してもよろしいですか？`,
    );
    if (confirmed) {
      await removeCharacter(characterId);
    }
  };

  const handleCreateNewCharacter = () => {
    // TODO: キャラクター作成モーダルを開く
    console.log('Create new character');
  };

  const handleAddExistingCharacter = () => {
    // TODO: 既存キャラクター選択モーダルを開く
    console.log('Add existing character');
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
    characters,
    isCharactersLoading,
    handleCharacterClick,
    handleRemoveCharacter,
    handleCreateNewCharacter,
    handleAddExistingCharacter,
  };
};
