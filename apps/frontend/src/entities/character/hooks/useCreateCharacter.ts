import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { createCharacterAction } from '../actions/characterActions';
import {
  openCreateModal,
  closeCreateModal,
  setCreateName,
  setCreateDescription,
  characterSlice,
} from '../model/characterSlice';

/**
 * キャラクター作成処理を行うHook
 */
export const useCreateCharacter = () => {
  const dispatch = useAppDispatch();

  const characterState = useAppSelector(
    (state) => state[characterSlice.reducerPath],
  );

  const openModal = useCallback(() => {
    dispatch(openCreateModal());
  }, [dispatch]);

  const closeModal = useCallback(() => {
    dispatch(closeCreateModal());
  }, [dispatch]);

  const setName = useCallback(
    (name: string) => {
      dispatch(setCreateName(name));
    },
    [dispatch],
  );

  const setDescription = useCallback(
    (description: string) => {
      dispatch(setCreateDescription(description));
    },
    [dispatch],
  );

  const createCharacter = useCallback(async () => {
    if (!characterState.createName) {
      return;
    }

    await dispatch(
      createCharacterAction({
        name: characterState.createName,
        description: characterState.createDescription,
      }),
    );
  }, [dispatch, characterState.createName, characterState.createDescription]);

  return {
    isOpen: characterState.isCreateModalOpen,
    name: characterState.createName,
    description: characterState.createDescription,
    isSubmitting: characterState.isSubmitting,
    openModal,
    closeModal,
    setName,
    setDescription,
    createCharacter,
  };
};
