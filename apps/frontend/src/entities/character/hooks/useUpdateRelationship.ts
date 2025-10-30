import type { Relationship } from '@trpg-scenario-maker/schema';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { updateRelationshipAction } from '../actions/relationshipActions';
import {
  openRelationshipEditModal,
  closeRelationshipEditModal,
  setEditRelationshipName,
  relationshipSlice,
} from '../model/relationshipSlice';

/**
 * 関係性更新処理を行うHook
 */
export const useUpdateRelationship = () => {
  const dispatch = useAppDispatch();

  const relationshipState = useAppSelector(
    (state) => state[relationshipSlice.reducerPath],
  );

  const openModal = useCallback(
    (relationship: Relationship) => {
      dispatch(openRelationshipEditModal(relationship));
    },
    [dispatch],
  );

  const closeModal = useCallback(() => {
    dispatch(closeRelationshipEditModal());
  }, [dispatch]);

  const setRelationshipName = useCallback(
    (name: string) => {
      dispatch(setEditRelationshipName(name));
    },
    [dispatch],
  );

  const updateRelationship = useCallback(async () => {
    if (
      !relationshipState.editFromCharacterId ||
      !relationshipState.editToCharacterId ||
      !relationshipState.editRelationshipName
    ) {
      return;
    }

    await dispatch(
      updateRelationshipAction({
        fromCharacterId: relationshipState.editFromCharacterId,
        toCharacterId: relationshipState.editToCharacterId,
        relationshipName: relationshipState.editRelationshipName,
      }),
    );
  }, [
    dispatch,
    relationshipState.editFromCharacterId,
    relationshipState.editToCharacterId,
    relationshipState.editRelationshipName,
  ]);

  return {
    isOpen: relationshipState.isEditModalOpen,
    editingRelationship: relationshipState.editingRelationship,
    relationshipName: relationshipState.editRelationshipName,
    isSubmitting: relationshipState.isSubmitting,
    openModal,
    closeModal,
    setRelationshipName,
    updateRelationship,
  };
};
