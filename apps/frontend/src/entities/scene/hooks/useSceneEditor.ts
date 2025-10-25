import { useCallback } from 'react';
import { useAppDispatch } from '@/shared/lib/store';
import {
  readScenesAction,
  readConnectionsAction,
} from '../actions/sceneActions';
import { useSceneList } from './useSceneList';
import { useSceneOperations } from './useSceneOperations';

/**
 * シーン編集のロジックを管理するカスタムフック（Redux対応）
 * useSceneListとuseSceneOperationsを統合したフック
 */
export function useSceneEditor(scenarioId: string) {
  const dispatch = useAppDispatch();

  // シーンとコネクションの状態を取得
  const { scenes, connections, isLoading, error } = useSceneList(scenarioId);

  // シーン操作用のハンドラーを取得
  const {
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
  } = useSceneOperations();

  // データを再読み込み
  const reload = useCallback(async () => {
    if (scenarioId) {
      await Promise.all([
        dispatch(readScenesAction(scenarioId)),
        dispatch(readConnectionsAction(scenarioId)),
      ]);
    }
  }, [dispatch, scenarioId]);

  return {
    scenes,
    connections,
    isLoading,
    error,
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
    reload,
  };
}
