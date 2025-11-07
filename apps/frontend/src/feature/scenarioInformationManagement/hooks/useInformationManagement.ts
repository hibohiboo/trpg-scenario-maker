import { useState } from 'react';
import {
  useInformationItemList,
  useInformationItemOperations,
  useInformationItemFormState,
} from '@/entities/informationItem';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';

/**
 * シナリオ詳細ページの情報項目管理機能
 *
 * 責務:
 * - 情報項目のCRUD操作
 * - 情報項目間の接続管理
 * - 情報項目とシーンの接続管理
 * - フォーム・モーダル状態の管理
 */
export function useInformationManagement() {
  // 情報項目データの取得
  const {
    items: informationItems,
    informationConnections,
    informationToSceneConnections,
    sceneInformationConnections,
    isLoading: isInformationItemsLoading,
  } = useInformationItemList();

  // 情報項目操作
  const {
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleAddInformationConnection,
    handleDeleteInformationConnection,
    handleAddInformationToSceneConnection,
    handleDeleteInformationToSceneConnection,
    handleAddSceneInformationConnection,
    handleDeleteSceneInformationConnection,
  } = useInformationItemOperations();

  // フォーム状態
  const {
    isFormOpen: isInformationItemFormOpen,
    editingItem: editingInformationItem,
    handleOpenForm: handleOpenInformationItemForm,
    handleCloseForm: handleCloseInformationItemForm,
    handleEditItem: handleEditInformationItem,
  } = useInformationItemFormState();

  // 接続モーダル状態
  const [
    isInformationConnectionModalOpen,
    setIsInformationConnectionModalOpen,
  ] = useState(false);

  // 情報項目作成
  const handleCreateInformationItem = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      await handleAddItem(data);
      handleCloseInformationItemForm();
    } catch (err) {
      console.error('Failed to create information item:', err);
      alert('情報項目の作成に失敗しました');
    }
  };

  // 情報項目更新
  const handleUpdateInformationItem = async (
    itemId: string,
    data: { title: string; description: string },
  ) => {
    try {
      await handleUpdateItem(itemId, data);
      handleCloseInformationItemForm();
    } catch (err) {
      console.error('Failed to update information item:', err);
      alert('情報項目の更新に失敗しました');
    }
  };

  // 情報項目削除
  const handleDeleteInformationItem = async (itemId: string) => {
    const item = informationItems.find((i) => i.id === itemId);
    if (!item) return;

    const confirmed = window.confirm(
      `情報項目「${item.title}」を削除してもよろしいですか？\nこの操作は取り消せません。`,
    );
    if (confirmed) {
      try {
        await handleDeleteItem(itemId);
        handleCloseInformationItemForm();
      } catch (err) {
        console.error('Failed to delete information item:', err);
        alert('情報項目の削除に失敗しました');
      }
    }
  };

  // 接続モーダル制御
  const handleOpenInformationConnectionModal = () => {
    setIsInformationConnectionModalOpen(true);
  };

  const handleCloseInformationConnectionModal = () => {
    setIsInformationConnectionModalOpen(false);
  };

  // 情報項目間接続作成
  const handleCreateInformationConnection = async (params: {
    source: string;
    target: string;
  }) => {
    try {
      await handleAddInformationConnection(params);
      await graphdbWorkerClient.save();
      handleCloseInformationConnectionModal();
    } catch (err) {
      console.error('Failed to create information connection:', err);
      alert('情報項目の関連作成に失敗しました');
    }
  };

  // 情報項目間接続削除
  const handleRemoveInformationConnection = async (connectionId: string) => {
    const confirmed = window.confirm(
      '情報項目の関連を削除してもよろしいですか？',
    );
    if (confirmed) {
      try {
        await handleDeleteInformationConnection(connectionId);
        await graphdbWorkerClient.save();
      } catch (err) {
        console.error('Failed to remove information connection:', err);
        alert('情報項目の関連削除に失敗しました');
      }
    }
  };

  // 情報項目→シーン接続作成
  const handleAddInformationToScene = async (
    informationItemId: string,
    sceneId: string,
  ) => {
    try {
      await handleAddInformationToSceneConnection({
        informationItemId,
        sceneId,
      });
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to add information to scene connection:', err);
      alert('情報項目とシーンの関連作成に失敗しました');
    }
  };

  // 情報項目→シーン接続削除
  const handleRemoveInformationToScene = async (connectionId: string) => {
    try {
      await handleDeleteInformationToSceneConnection(connectionId);
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to remove information to scene connection:', err);
      alert('情報項目とシーンの関連削除に失敗しました');
    }
  };

  // シーン→情報項目接続作成
  const handleAddSceneInformation = async (
    sceneId: string,
    informationItemId: string,
  ) => {
    try {
      await handleAddSceneInformationConnection({ sceneId, informationItemId });
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to add scene information connection:', err);
      alert('シーンと情報項目の関連作成に失敗しました');
    }
  };

  // シーン→情報項目接続削除
  const handleRemoveSceneInformation = async (connectionId: string) => {
    try {
      await handleDeleteSceneInformationConnection(connectionId);
      await graphdbWorkerClient.save();
    } catch (err) {
      console.error('Failed to remove scene information connection:', err);
      alert('シーンと情報項目の関連削除に失敗しました');
    }
  };

  return {
    // データ
    informationItems,
    informationConnections,
    informationToSceneConnections,
    sceneInformationConnections,
    isInformationItemsLoading,

    // フォーム状態
    isInformationItemFormOpen,
    editingInformationItem,

    // モーダル状態
    isInformationConnectionModalOpen,

    // 情報項目操作
    handleCreateInformationItem,
    handleUpdateInformationItem,
    handleDeleteInformationItem,
    handleOpenInformationItemForm,
    handleCloseInformationItemForm,
    handleEditInformationItem,

    // 接続操作
    handleOpenInformationConnectionModal,
    handleCloseInformationConnectionModal,
    handleCreateInformationConnection,
    handleRemoveInformationConnection,
    handleAddInformationToScene,
    handleRemoveInformationToScene,
    handleAddSceneInformation,
    handleRemoveSceneInformation,
  };
}
