import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import {
  readScenarioCharactersAction,
  addCharacterToScenarioAction,
  removeCharacterFromScenarioAction,
  updateCharacterRoleAction,
} from '../actions/scenarioCharacterActions';
import {
  scenarioCharactersSelector,
  scenarioCharacterLoadingSelector,
  scenarioCharacterSubmittingSelector,
} from '../model/scenarioCharacterSlice';

export const useScenarioCharacterList = (scenarioId: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (scenarioId) {
      dispatch(readScenarioCharactersAction({ scenarioId }));
    }
  }, [dispatch, scenarioId]);

  const characters = useAppSelector((state) =>
    scenarioCharactersSelector(state, scenarioId),
  );
  const isLoading = useAppSelector(scenarioCharacterLoadingSelector);
  const isSubmitting = useAppSelector(scenarioCharacterSubmittingSelector);

  const addCharacter = useCallback(
    async (characterId: string, role?: string) => {
      await dispatch(
        addCharacterToScenarioAction({ scenarioId, characterId, role }),
      ).unwrap();
    },
    [dispatch, scenarioId],
  );

  const removeCharacter = useCallback(
    async (characterId: string) => {
      await dispatch(
        removeCharacterFromScenarioAction({ scenarioId, characterId }),
      ).unwrap();
    },
    [dispatch, scenarioId],
  );

  const updateRole = useCallback(
    async (characterId: string, role: string) => {
      await dispatch(
        updateCharacterRoleAction({ scenarioId, characterId, role }),
      ).unwrap();
    },
    [dispatch, scenarioId],
  );

  return {
    characters,
    isLoading,
    isSubmitting,
    addCharacter,
    removeCharacter,
    updateRole,
  };
};
