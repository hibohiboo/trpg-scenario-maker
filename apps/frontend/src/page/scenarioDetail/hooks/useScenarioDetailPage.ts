import { useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { scenarioGraphApi } from '@/entities/scenario';
import {
  useSceneList,
  useSceneOperations,
  useSceneFormState,
} from '@/entities/scene';

export const useScenarioDetailPage = () => {
  const { id } = useParams();
  const data = useLoaderData();

  useEffect(() => {
    scenarioGraphApi.create(data);
  }, [id, data]);

  if (!id) {
    throw new Error('シナリオIDが見つかりません');
  }

  const { scenes, connections, isLoading, error } = useSceneList(id);
  const {
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
  } = useSceneOperations();
  const {
    isFormOpen,
    editingScene,
    handleOpenForm,
    handleCloseForm,
    handleEditScene,
  } = useSceneFormState();

  const handleSave = async () => {
    await scenarioGraphApi.save();
    alert('シナリオを保存しました');
  };

  return {
    id,
    scenes,
    connections,
    isLoading,
    error,
    isFormOpen,
    editingScene,
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
    handleOpenForm,
    handleCloseForm,
    handleEditScene,
    handleSave,
  };
};
