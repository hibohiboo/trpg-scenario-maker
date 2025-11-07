import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import {
  createInformationConnectionAction,
  createInformationItemAction,
  createInformationToSceneConnectionAction,
  createSceneInformationConnectionAction,
  deleteInformationConnectionAction,
  deleteInformationItemAction,
  deleteInformationToSceneConnectionAction,
  deleteSceneInformationConnectionAction,
  updateInformationItemAction,
} from '../actions/informationItemActions';
import { informationItemSlice } from '../model/informationItemSlice';
import type {
  InformationItem,
  InformationItemConnection,
  InformationToSceneConnection,
  SceneInformationConnection,
} from '@trpg-scenario-maker/ui';

/**
 * 情報項目操作（追加・更新・削除）を行うカスタムフック
 */
export const useInformationItemOperations = () => {
  const dispatch = useAppDispatch();
  const currentScenarioId = useAppSelector(
    (state) => state[informationItemSlice.reducerPath].currentScenarioId,
  );

  // 情報項目のCRUD操作
  const handleAddItem = useCallback(
    async (item: Omit<InformationItem, 'id' | 'scenarioId'>) => {
      if (!currentScenarioId) {
        throw new Error('No scenario selected');
      }
      await dispatch(
        createInformationItemAction({ scenarioId: currentScenarioId, item }),
      ).unwrap();
    },
    [dispatch, currentScenarioId],
  );

  const handleUpdateItem = useCallback(
    async (id: string, updates: Partial<InformationItem>) => {
      await dispatch(updateInformationItemAction({ id, updates })).unwrap();
    },
    [dispatch],
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      await dispatch(deleteInformationItemAction(id)).unwrap();
    },
    [dispatch],
  );

  // 情報項目同士の関連操作
  const handleAddInformationConnection = useCallback(
    async (connection: Omit<InformationItemConnection, 'id'>) => {
      await dispatch(
        createInformationConnectionAction(connection),
      ).unwrap();
    },
    [dispatch],
  );

  const handleDeleteInformationConnection = useCallback(
    async (id: string) => {
      await dispatch(deleteInformationConnectionAction(id)).unwrap();
    },
    [dispatch],
  );

  // シーン→情報項目の関連操作
  const handleAddSceneInformationConnection = useCallback(
    async (connection: Omit<SceneInformationConnection, 'id'>) => {
      await dispatch(
        createSceneInformationConnectionAction(connection),
      ).unwrap();
    },
    [dispatch],
  );

  const handleDeleteSceneInformationConnection = useCallback(
    async (id: string) => {
      await dispatch(deleteSceneInformationConnectionAction(id)).unwrap();
    },
    [dispatch],
  );

  // 情報項目→シーンの関連操作
  const handleAddInformationToSceneConnection = useCallback(
    async (connection: Omit<InformationToSceneConnection, 'id'>) => {
      await dispatch(
        createInformationToSceneConnectionAction(connection),
      ).unwrap();
    },
    [dispatch],
  );

  const handleDeleteInformationToSceneConnection = useCallback(
    async (id: string) => {
      await dispatch(deleteInformationToSceneConnectionAction(id)).unwrap();
    },
    [dispatch],
  );

  return {
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleAddInformationConnection,
    handleDeleteInformationConnection,
    handleAddSceneInformationConnection,
    handleDeleteSceneInformationConnection,
    handleAddInformationToSceneConnection,
    handleDeleteInformationToSceneConnection,
  };
};
