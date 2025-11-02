import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { readScenarioCharactersAction } from '../actions/scenarioCharacterActions';
import {
  scenarioCharactersSelector,
  scenarioCharacterLoadingSelector,
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

  return {
    characters,
    isLoading,
  };
};
