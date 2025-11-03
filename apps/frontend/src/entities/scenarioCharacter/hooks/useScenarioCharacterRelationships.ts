import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { readScenarioCharacterRelationsAction } from '../actions/scenarioCharacterActions';
import {
  scenarioCharacterRelationsSelector,
  scenarioCharacterLoadingSelector,
} from '../model/scenarioCharacterSlice';

export const useScenarioCharacterRelationships = (scenarioId: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (scenarioId) {
      dispatch(readScenarioCharacterRelationsAction({ scenarioId }));
    }
  }, [dispatch, scenarioId]);

  const relations = useAppSelector((state) =>
    scenarioCharacterRelationsSelector(state, scenarioId),
  );
  const isLoading = useAppSelector(scenarioCharacterLoadingSelector);

  return {
    relations,
    isLoading,
  };
};
