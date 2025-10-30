import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { createRelationshipAction } from '../actions/relationshipActions';
import {
  openRelationshipCreateModal,
  closeRelationshipCreateModal,
  setCreateFromCharacterId,
  setCreateToCharacterId,
  setCreateRelationshipName,
  relationshipSlice,
} from '../model/relationshipSlice';

/**
 * 関係性作成処理を行うHook
 */
export const useCreateRelationship = () => {
  const dispatch = useAppDispatch();

  const relationshipState = useAppSelector(
    (state) => state[relationshipSlice.reducerPath],
  );

  const openModal = useCallback(
    (fromCharacterId?: string) => {
      dispatch(openRelationshipCreateModal({ fromCharacterId }));
    },
    [dispatch],
  );

  const closeModal = useCallback(() => {
    dispatch(closeRelationshipCreateModal());
  }, [dispatch]);

  const setFromCharacterId = useCallback(
    (id: string) => {
      dispatch(setCreateFromCharacterId(id));
    },
    [dispatch],
  );

  const setToCharacterId = useCallback(
    (id: string) => {
      dispatch(setCreateToCharacterId(id));
    },
    [dispatch],
  );

  const setRelationshipName = useCallback(
    (name: string) => {
      dispatch(setCreateRelationshipName(name));
    },
    [dispatch],
  );

  const createRelationship = useCallback(async () => {
    if (
      !relationshipState.createFromCharacterId ||
      !relationshipState.createToCharacterId ||
      !relationshipState.createRelationshipName
    ) {
      return;
    }

    await dispatch(
      createRelationshipAction({
        fromCharacterId: relationshipState.createFromCharacterId,
        toCharacterId: relationshipState.createToCharacterId,
        relationshipName: relationshipState.createRelationshipName,
      }),
    );
  }, [
    dispatch,
    relationshipState.createFromCharacterId,
    relationshipState.createToCharacterId,
    relationshipState.createRelationshipName,
  ]);

  return {
    isOpen: relationshipState.isCreateModalOpen,
    fromCharacterId: relationshipState.createFromCharacterId,
    toCharacterId: relationshipState.createToCharacterId,
    relationshipName: relationshipState.createRelationshipName,
    isSubmitting: relationshipState.isSubmitting,
    openModal,
    closeModal,
    setFromCharacterId,
    setToCharacterId,
    setRelationshipName,
    createRelationship,
  };
};
