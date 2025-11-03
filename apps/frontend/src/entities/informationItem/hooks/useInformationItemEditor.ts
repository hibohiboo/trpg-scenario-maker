import { useCallback } from 'react';
import { useAppDispatch } from '@/shared/lib/store';
import {
  readInformationConnectionsAction,
  readInformationItemsAction,
} from '../actions/informationItemActions';
import { useInformationItemList } from './useInformationItemList';
import { useInformationItemOperations } from './useInformationItemOperations';

/**
 * 情報項目編集のロジックを管理するカスタムフック（Redux対応）
 * useInformationItemListとuseInformationItemOperationsを統合したフック
 */
export function useInformationItemEditor(scenarioId: string) {
  const dispatch = useAppDispatch();

  // 情報項目とコネクションの状態を取得
  const {
    items,
    informationConnections,
    sceneInformationConnections,
    informationToSceneConnections,
    isLoading,
    error,
  } = useInformationItemList();

  // 情報項目操作用のハンドラーを取得
  const {
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleAddInformationConnection,
    handleDeleteInformationConnection,
    handleAddSceneInformationConnection,
    handleDeleteSceneInformationConnection,
    handleAddInformationToSceneConnection,
    handleDeleteInformationToSceneConnection,
  } = useInformationItemOperations();

  // データを再読み込み
  const reload = useCallback(async () => {
    if (scenarioId) {
      await Promise.all([
        dispatch(readInformationItemsAction(scenarioId)),
        dispatch(readInformationConnectionsAction(scenarioId)),
      ]);
    }
  }, [dispatch, scenarioId]);

  return {
    items,
    informationConnections,
    sceneInformationConnections,
    informationToSceneConnections,
    isLoading,
    error,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleAddInformationConnection,
    handleDeleteInformationConnection,
    handleAddSceneInformationConnection,
    handleDeleteSceneInformationConnection,
    handleAddInformationToSceneConnection,
    handleDeleteInformationToSceneConnection,
    reload,
  };
}
