import { generateUUID } from '@trpg-scenario-maker/utility';
import { useState } from 'react';
import { characterGraphApi } from '@/entities/character';
import {
  useScenarioCharacterList,
  useScenarioCharacterRelationships,
  scenarioCharacterRelationGraphApi,
  readScenarioCharacterRelationsAction,
} from '@/entities/scenarioCharacter';
import { useAppDispatch } from '@/shared/lib/store';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import type {
  CharacterWithRole,
  ScenarioCharacterRelation,
} from '@trpg-scenario-maker/ui';

/**
 * シナリオ詳細ページのキャラクター管理機能
 *
 * 責務:
 * - キャラクターのCRUD操作
 * - シナリオへのキャラクター追加・削除
 * - キャラクター間の関係性管理
 * - モーダル状態の管理
 */
export function useCharacterManagement(scenarioId: string) {
  const dispatch = useAppDispatch();

  // モーダル状態
  const [isCharacterFormOpen, setIsCharacterFormOpen] = useState(false);
  const [isCharacterEditOpen, setIsCharacterEditOpen] = useState(false);
  const [isRelationshipFormOpen, setIsRelationshipFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] =
    useState<CharacterWithRole | null>(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterWithRole | null>(null);

  // キャラクターデータの取得
  const {
    characters,
    isLoading: isCharactersLoading,
    addCharacter,
    removeCharacter,
    updateRole,
  } = useScenarioCharacterList(scenarioId);

  // 関係性データの取得
  const { relations, isLoading: isRelationsLoading } =
    useScenarioCharacterRelationships(scenarioId);

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
  const handleCloseCharacterForm = () => {
    setIsCharacterFormOpen(false);
  };
  // キャラクター作成
  const handleCreateNewCharacter = async (params: {
    name: string;
    description: string;
    role: string;
  }) => {
    try {
      // キャラクターを作成
      const characterId = generateUUID();
      await characterGraphApi.create({
        id: characterId,
        name: params.name,
        description: params.description,
      });

      // シナリオに追加
      await addCharacter(characterId, params.role);

      // 保存
      await graphdbWorkerClient.save();

      handleCloseCharacterForm();
    } catch (err) {
      console.error('Failed to create character:', err);
      alert('キャラクターの作成に失敗しました');
    }
  };
  const handleCloseEditCharacter = () => {
    setEditingCharacter(null);
    setIsCharacterEditOpen(false);
  };
  // キャラクター更新
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

      handleCloseEditCharacter();
    } catch (err) {
      console.error('Failed to update character:', err);
      alert('キャラクターの更新に失敗しました');
    }
  };

  // キャラクター削除
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

  // モーダル制御
  const handleOpenCharacterForm = () => {
    setIsCharacterFormOpen(true);
  };

  const handleOpenEditCharacter = (character: CharacterWithRole) => {
    setEditingCharacter(character);
    setIsCharacterEditOpen(true);
  };

  const handleOpenRelationshipForm = () => {
    setIsRelationshipFormOpen(true);
  };

  const handleCloseRelationshipForm = () => {
    setIsRelationshipFormOpen(false);
  };

  // 関係性作成
  const handleSubmitRelationship = async (params: {
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }) => {
    try {
      await scenarioCharacterRelationGraphApi.create({
        scenarioId,
        ...params,
      });
      await graphdbWorkerClient.save();
      // 関係性リストを再取得
      dispatch(readScenarioCharacterRelationsAction({ scenarioId }));

      handleCloseRelationshipForm();
    } catch (err) {
      console.error('Failed to create relationship:', err);
      alert('関係性の作成に失敗しました');
    }
  };

  // 関係性削除
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
          scenarioId,
          fromCharacterId,
          toCharacterId,
        });
        await graphdbWorkerClient.save();
        // 関係性リストを再取得
        dispatch(readScenarioCharacterRelationsAction({ scenarioId }));
      } catch (err) {
        console.error('Failed to remove relationship:', err);
        alert('関係性の削除に失敗しました');
      }
    }
  };

  const handleCharacterClick = (character: CharacterWithRole) => {
    setSelectedCharacter(character);
  };

  const handleCloseCharacterDetail = () => {
    setSelectedCharacter(null);
  };

  return {
    // データ
    characters,
    characterRelations,
    isCharactersLoading,
    isRelationsLoading,

    // モーダル状態
    isCharacterFormOpen,
    isCharacterEditOpen,
    isRelationshipFormOpen,
    editingCharacter,
    selectedCharacter,

    // キャラクター操作
    handleCreateNewCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter,
    handleOpenCharacterForm,
    handleCloseCharacterForm,
    handleOpenEditCharacter,
    handleCloseEditCharacter,
    handleCharacterClick,
    handleCloseCharacterDetail,

    // 関係性操作
    handleSubmitRelationship,
    handleRemoveRelationship,
    handleOpenRelationshipForm,
    handleCloseRelationshipForm,
  };
}
