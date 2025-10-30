import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { setSelectedCharacterId, relationshipSlice } from '../model/relationshipSlice';
import { useAllRelationships } from './useAllRelationships';
import { useCharacterList } from './useCharacterList';
import { useCreateRelationship } from './useCreateRelationship';
import { useDeleteRelationship } from './useDeleteRelationship';
import { useUpdateRelationship } from './useUpdateRelationship';

/**
 * キャラクター関係性ページの統合Hook
 */
export const useCharacterRelationshipPage = () => {
  const dispatch = useAppDispatch();

  // キャラクターリスト
  const { characters, isLoading: isLoadingCharacters } = useCharacterList();

  // 関係性リスト
  const { relationships, isLoading: isLoadingRelationships } = useAllRelationships();

  // 作成
  const {
    isOpen: isCreateModalOpen,
    fromCharacterId: createFromCharacterId,
    toCharacterId: createToCharacterId,
    relationshipName: createRelationshipName,
    isSubmitting: isCreating,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
    setFromCharacterId: setCreateFromCharacterId,
    setToCharacterId: setCreateToCharacterId,
    setRelationshipName: setCreateRelationshipName,
    createRelationship,
  } = useCreateRelationship();

  // 更新
  const {
    isOpen: isEditModalOpen,
    editingRelationship,
    relationshipName: editRelationshipName,
    isSubmitting: isUpdating,
    openModal: openEditModal,
    closeModal: closeEditModal,
    setRelationshipName: setEditRelationshipName,
    updateRelationship,
  } = useUpdateRelationship();

  // 削除
  const {
    isOpen: isDeleteModalOpen,
    deletingRelationship,
    isDeleting,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    deleteRelationship,
  } = useDeleteRelationship();

  // 選択中のキャラクター
  const selectedCharacterId = useAppSelector(
    (state) => state[relationshipSlice.reducerPath].selectedCharacterId,
  );

  const handleCharacterClick = useCallback(
    (character: { id: string }) => {
      dispatch(setSelectedCharacterId(character.id));
    },
    [dispatch],
  );

  return {
    // キャラクターリスト
    characters,
    isLoadingCharacters,
    selectedCharacterId,
    onCharacterClick: handleCharacterClick,

    // 関係性リスト
    relationships,
    isLoadingRelationships,

    // 作成モーダル
    isCreateModalOpen,
    createFromCharacterId,
    createToCharacterId,
    createRelationshipName,
    isSubmitting: isCreating,
    onCreateNew: openCreateModal,
    onCloseCreateModal: closeCreateModal,
    onCreateFromCharacterChange: setCreateFromCharacterId,
    onCreateToCharacterChange: setCreateToCharacterId,
    onCreateRelationshipNameChange: setCreateRelationshipName,
    onCreateSubmit: createRelationship,

    // 編集モーダル
    isEditModalOpen,
    editingRelationship,
    editRelationshipName,
    isUpdating,
    onEdit: openEditModal,
    onCloseEditModal: closeEditModal,
    onEditRelationshipNameChange: setEditRelationshipName,
    onEditSubmit: updateRelationship,

    // 削除モーダル
    isDeleteModalOpen,
    deletingRelationship,
    isDeleting,
    onDelete: openDeleteModal,
    onCloseDeleteModal: closeDeleteModal,
    onDeleteConfirm: deleteRelationship,
  };
};
