import type {
  SceneEventType,
  CharacterWithRole,
  ScenarioCharacterRelation,
} from '@trpg-scenario-maker/ui';
import { useState } from 'react';
import { useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import { characterGraphApi } from '@/entities/character';
import { scenarioGraphApi } from '@/entities/scenario';
import {
  useScenarioCharacterList,
  useScenarioCharacterRelationships,
  scenarioCharacterRelationGraphApi,
  readScenarioCharacterRelationsAction,
} from '@/entities/scenarioCharacter';
import {
  useSceneList,
  useSceneOperations,
  useSceneFormState,
} from '@/entities/scene';
import {
  useSceneEventOperations,
  sceneEventSlice,
} from '@/entities/sceneEvent';
import { useAppSelector, useAppDispatch } from '@/shared/lib/store';

export const useScenarioDetailPage = () => {
  const { id } = useParams();
  if (!id) throw new Error('シナリオIDが見つかりません');

  const dispatch = useAppDispatch();
  const [isRelationshipFormOpen, setIsRelationshipFormOpen] = useState(false);

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
    addCharacter,
    removeCharacter,
    updateRole,
  } = useScenarioCharacterList(id);

  const { relations, isLoading: isRelationsLoading } =
    useScenarioCharacterRelationships(id);

  // 関係性データをUIコンポーネント用に変換
  const characterRelations: ScenarioCharacterRelation[] = relations.map(
    (rel) => {
      const fromChar = characters.find(
        (c) => c.characterId === rel.fromCharacterId,
      );
      const toChar = characters.find(
        (c) => c.characterId === rel.toCharacterId,
      );
      return {
        scenarioId: rel.scenarioId,
        fromCharacterId: rel.fromCharacterId,
        fromCharacterName: fromChar?.name || '不明',
        toCharacterId: rel.toCharacterId,
        toCharacterName: toChar?.name || '不明',
        relationshipName: rel.relationshipName,
      };
    },
  );

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

  const handleCreateNewCharacter = async () => {
    const name = window.prompt('キャラクター名を入力してください');
    if (!name) return;

    const description = window.prompt('キャラクターの説明を入力してください（省略可）') || '';
    const role = window.prompt('シナリオ内での役割を入力してください（省略可）') || '';

    try {
      // キャラクターを作成
      const characterId = uuidv4();
      await characterGraphApi.create({
        id: characterId,
        name,
        description,
      });

      // シナリオに追加
      await addCharacter(characterId, role);

      // 保存
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to create character:', err);
      alert('キャラクターの作成に失敗しました');
    }
  };

  const handleAddExistingCharacter = () => {
    // TODO: 既存キャラクター選択モーダルを開く
    console.log('Add existing character');
  };

  const handleEditCharacter = async (character: CharacterWithRole) => {
    const newRole = window.prompt(
      `「${character.name}」の役割を入力してください`,
      character.role || '',
    );
    if (newRole === null) return; // キャンセルされた場合

    try {
      await updateRole(character.characterId, newRole);
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to update character role:', err);
      alert('役割の更新に失敗しました');
    }
  };

  const handleOpenRelationshipForm = () => {
    setIsRelationshipFormOpen(true);
  };

  const handleCloseRelationshipForm = () => {
    setIsRelationshipFormOpen(false);
  };

  const handleSubmitRelationship = async (params: {
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }) => {
    try {
      await scenarioCharacterRelationGraphApi.create({
        scenarioId: id,
        ...params,
      });
      await graphdbWorkerClient.save();
      // 関係性リストを再取得
      dispatch(readScenarioCharacterRelationsAction({ scenarioId: id }));
    } catch (err) {
      console.error('Failed to create relationship:', err);
      alert('関係性の作成に失敗しました');
    }
  };

  const handleRemoveRelationship = async (
    fromCharacterId: string,
    toCharacterId: string,
  ) => {
    const fromChar = characters.find((c) => c.characterId === fromCharacterId);
    const toChar = characters.find((c) => c.characterId === toCharacterId);

    const confirmed = window.confirm(
      `「${fromChar?.name || '不明'}」から「${toChar?.name || '不明'}」への関係性を削除してもよろしいですか？`,
    );
    if (confirmed) {
      try {
        await scenarioCharacterRelationGraphApi.delete({
          scenarioId: id,
          fromCharacterId,
          toCharacterId,
        });
        await graphdbWorkerClient.save();
      } catch (err) {
        console.error('Failed to remove relationship:', err);
        alert('関係性の削除に失敗しました');
      }
    }
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
    handleEditCharacter,
    handleRemoveCharacter,
    handleCreateNewCharacter,
    handleAddExistingCharacter,
    characterRelations,
    isRelationsLoading,
    isRelationshipFormOpen,
    handleAddRelationship: handleOpenRelationshipForm,
    handleCloseRelationshipForm,
    handleSubmitRelationship,
    handleRemoveRelationship,
  };
};
