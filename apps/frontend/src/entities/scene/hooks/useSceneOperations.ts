import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import {
  createSceneAction,
  updateSceneAction,
  deleteSceneAction,
  createConnectionAction,
  deleteConnectionAction,
} from '../actions/sceneActions';
import { sceneSlice } from '../model/sceneSlice';
import type { Scene, SceneConnection } from '@trpg-scenario-maker/ui';

/**
 * シーン操作（追加・更新・削除）を行うカスタムフック
 */
export const useSceneOperations = () => {
  const dispatch = useAppDispatch();
  const currentScenarioId = useAppSelector(
    (state) => state[sceneSlice.reducerPath].currentScenarioId,
  );

  const handleAddScene = useCallback(
    async (scene: Omit<Scene, 'id'>) => {
      if (!currentScenarioId) {
        throw new Error('No scenario selected');
      }
      await dispatch(
        createSceneAction({ scenarioId: currentScenarioId, scene }),
      ).unwrap();
    },
    [dispatch, currentScenarioId],
  );

  const handleUpdateScene = useCallback(
    async (id: string, updates: Partial<Scene>) => {
      await dispatch(updateSceneAction({ id, updates })).unwrap();
    },
    [dispatch],
  );

  const handleDeleteScene = useCallback(
    async (id: string) => {
      await dispatch(deleteSceneAction(id)).unwrap();
    },
    [dispatch],
  );

  const handleAddConnection = useCallback(
    async (connection: Omit<SceneConnection, 'id'>) => {
      await dispatch(createConnectionAction(connection)).unwrap();
    },
    [dispatch],
  );

  const handleUpdateConnection = useCallback(
    async (id: string, updates: Partial<SceneConnection>) => {
      // 現時点では接続の更新は未実装
      console.log('Connection update not implemented yet', id, updates);
    },
    [],
  );

  const handleDeleteConnection = useCallback(
    async (id: string) => {
      await dispatch(deleteConnectionAction(id)).unwrap();
    },
    [dispatch],
  );

  return {
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
  };
};
