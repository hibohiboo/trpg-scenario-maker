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
import {
  useInformationItemList,
  useInformationItemOperations,
  useInformationItemFormState,
} from '@/entities/informationItem';
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
import {
  scenarioDetailCurrentTabSelector,
  scenarioDetailTabItemsSelector,
  setScenarioDetailCurrentTab,
} from '../models/scenarioDetailSlice';

export const useScenarioDetailPage = () => {
  const { id } = useParams();
  if (!id) throw new Error('シナリオIDが見つかりません');

  const dispatch = useAppDispatch();
  const [isRelationshipFormOpen, setIsRelationshipFormOpen] = useState(false);
  const [isCharacterFormOpen, setIsCharacterFormOpen] = useState(false);
  const [isCharacterEditOpen, setIsCharacterEditOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] =
    useState<CharacterWithRole | null>(null);
  const currentTab = useAppSelector(scenarioDetailCurrentTabSelector);
  const tabItems = useAppSelector(scenarioDetailTabItemsSelector);

  // 情報項目関連
  const {
    items: informationItems,
    informationConnections,
    informationToSceneConnections,
    isLoading: isInformationItemsLoading,
  } = useInformationItemList();
  const {
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleAddInformationConnection,
    handleDeleteInformationConnection,
    handleAddInformationToSceneConnection,
    handleDeleteInformationToSceneConnection,
  } = useInformationItemOperations();
  const {
    isFormOpen: isInformationItemFormOpen,
    editingItem: editingInformationItem,
    handleOpenForm: handleOpenInformationItemForm,
    handleCloseForm: handleCloseInformationItemForm,
    handleEditItem: handleEditInformationItem,
  } = useInformationItemFormState();
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

  const handleOpenCharacterForm = () => {
    setIsCharacterFormOpen(true);
  };

  const handleCloseCharacterForm = () => {
    setIsCharacterFormOpen(false);
  };

  const handleCreateNewCharacter = async (params: {
    name: string;
    description: string;
    role: string;
  }) => {
    try {
      // キャラクターを作成
      const characterId = uuidv4();
      await characterGraphApi.create({
        id: characterId,
        name: params.name,
        description: params.description,
      });

      // シナリオに追加
      await addCharacter(characterId, params.role);

      // 保存
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to create character:', err);
      alert('キャラクターの作成に失敗しました');
    }
  };

  const handleAddExistingCharacter = undefined;

  const handleOpenEditCharacter = (character: CharacterWithRole) => {
    setEditingCharacter(character);
    setIsCharacterEditOpen(true);
  };

  const handleCloseEditCharacter = () => {
    setEditingCharacter(null);
    setIsCharacterEditOpen(false);
  };

  const handleUpdateCharacter = async (params: {
    characterId: string;
    name: string;
    description: string;
    role: string;
  }) => {
    try {
      // キャラクター情報を更新
      await characterGraphApi.update({
        id: params.characterId,
        name: params.name,
        description: params.description,
      });

      // 役割を更新
      await updateRole(params.characterId, params.role);

      // 保存
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to update character:', err);
      alert('キャラクターの更新に失敗しました');
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
  const handleChangeTab = (tab: string) => {
    dispatch(setScenarioDetailCurrentTab(tab));
  };

  const handleCreateInformationItem = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      await handleAddItem(data);
      handleCloseInformationItemForm();
    } catch (err) {
      console.error('Failed to create information item:', err);
      alert('情報項目の作成に失敗しました');
    }
  };

  const handleUpdateInformationItem = async (
    itemId: string,
    data: { title: string; description: string },
  ) => {
    try {
      await handleUpdateItem(itemId, data);
      handleCloseInformationItemForm();
    } catch (err) {
      console.error('Failed to update information item:', err);
      alert('情報項目の更新に失敗しました');
    }
  };

  const handleDeleteInformationItem = async (itemId: string) => {
    const item = informationItems.find((i) => i.id === itemId);
    if (!item) return;

    const confirmed = window.confirm(
      `情報項目「${item.title}」を削除してもよろしいですか？\nこの操作は取り消せません。`,
    );
    if (confirmed) {
      try {
        await handleDeleteItem(itemId);
        handleCloseInformationItemForm();
      } catch (err) {
        console.error('Failed to delete information item:', err);
        alert('情報項目の削除に失敗しました');
      }
    }
  };

  const [
    isInformationConnectionModalOpen,
    setIsInformationConnectionModalOpen,
  ] = useState(false);

  const handleOpenInformationConnectionModal = () => {
    setIsInformationConnectionModalOpen(true);
  };

  const handleCloseInformationConnectionModal = () => {
    setIsInformationConnectionModalOpen(false);
  };

  const handleCreateInformationConnection = async (params: {
    source: string;
    target: string;
  }) => {
    try {
      await handleAddInformationConnection(params);
      await graphdbWorkerClient.save();
      handleCloseInformationConnectionModal();
    } catch (err) {
      console.error('Failed to create information connection:', err);
      alert('情報項目の関連作成に失敗しました');
    }
  };

  const handleRemoveInformationConnection = async (connectionId: string) => {
    const confirmed = window.confirm(
      '情報項目の関連を削除してもよろしいですか？',
    );
    if (confirmed) {
      try {
        await handleDeleteInformationConnection(connectionId);
        await graphdbWorkerClient.save();
      } catch (err) {
        console.error('Failed to remove information connection:', err);
        alert('情報項目の関連削除に失敗しました');
      }
    }
  };

  const handleAddInformationToScene = async (
    informationItemId: string,
    sceneId: string,
  ) => {
    try {
      await handleAddInformationToSceneConnection({
        informationItemId,
        sceneId,
      });
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to add information to scene connection:', err);
      alert('情報項目とシーンの関連作成に失敗しました');
    }
  };

  const handleRemoveInformationToScene = async (connectionId: string) => {
    try {
      await handleDeleteInformationToSceneConnection(connectionId);
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to remove information to scene connection:', err);
      alert('情報項目とシーンの関連削除に失敗しました');
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
    handleRemoveCharacter,
    isCharacterFormOpen,
    handleOpenCharacterForm,
    handleCloseCharacterForm,
    handleCreateNewCharacter,
    isCharacterEditOpen,
    editingCharacter,
    handleOpenEditCharacter,
    handleCloseEditCharacter,
    handleUpdateCharacter,
    handleAddExistingCharacter,
    characterRelations,
    isRelationsLoading,
    isRelationshipFormOpen,
    handleAddRelationship: handleOpenRelationshipForm,
    handleCloseRelationshipForm,
    handleSubmitRelationship,
    handleRemoveRelationship,
    tabItems,
    currentTab,
    handleChangeTab,
    informationItems,
    informationConnections,
    informationToSceneConnections,
    isInformationItemsLoading,
    isInformationItemFormOpen,
    editingInformationItem,
    handleOpenInformationItemForm,
    handleCloseInformationItemForm,
    handleCreateInformationItem,
    handleUpdateInformationItem,
    handleDeleteInformationItem,
    handleEditInformationItem,
    isInformationConnectionModalOpen,
    handleOpenInformationConnectionModal,
    handleCloseInformationConnectionModal,
    handleCreateInformationConnection,
    handleRemoveInformationConnection,
    handleAddInformationToScene,
    handleRemoveInformationToScene,
  };
};
