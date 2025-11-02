import type { Relationship } from '@trpg-scenario-maker/schema';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { deleteRelationshipAction } from '../actions/relationshipActions';
import {
  openRelationshipDeleteModal,
  closeRelationshipDeleteModal,
  relationshipSlice,
} from '../model/relationshipSlice';

/**
 * 関係性削除処理を行うHook
 */
export const useDeleteRelationship = () => {
  const dispatch = useAppDispatch();

  const relationshipState = useAppSelector(
    (state) => state[relationshipSlice.reducerPath],
  );

  const openModal = useCallback(
    (relationship: Relationship) => {
      dispatch(openRelationshipDeleteModal(relationship));
    },
    [dispatch],
  );

  const closeModal = useCallback(() => {
    dispatch(closeRelationshipDeleteModal());
  }, [dispatch]);

  const deleteRelationship = useCallback(async () => {
    if (!relationshipState.deletingRelationship) {
      return;
    }

    await dispatch(
      deleteRelationshipAction({
        id: relationshipState.deletingRelationship.id,
      }),
    );
  }, [dispatch, relationshipState.deletingRelationship]);

  return {
    isOpen: relationshipState.isDeleteModalOpen,
    deletingRelationship: relationshipState.deletingRelationship,
    isDeleting: relationshipState.isDeleting,
    openModal,
    closeModal,
    deleteRelationship,
  };
};
