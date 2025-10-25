import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import {
  readScenesAction,
  readConnectionsAction,
} from '../actions/sceneActions';
import { sceneSlice, setCurrentScenarioId } from '../model/sceneSlice';

/**
 * シーン一覧を取得するカスタムフック
 */
export const useSceneList = (scenarioId: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (scenarioId) {
      dispatch(setCurrentScenarioId(scenarioId));
      dispatch(readScenesAction(scenarioId));
      dispatch(readConnectionsAction(scenarioId));
    }
  }, [dispatch, scenarioId]);

  const scenes = useAppSelector((state) => state[sceneSlice.reducerPath].scenes);
  const connections = useAppSelector(
    (state) => state[sceneSlice.reducerPath].connections,
  );
  const isLoading = useAppSelector(
    (state) => state[sceneSlice.reducerPath].isLoading,
  );
  const error = useAppSelector((state) => state[sceneSlice.reducerPath].error);

  return {
    scenes,
    connections,
    isLoading,
    error,
  };
};
