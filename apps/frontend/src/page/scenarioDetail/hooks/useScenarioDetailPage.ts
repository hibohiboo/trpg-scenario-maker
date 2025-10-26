import { useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { scenarioGraphApi } from '@/entities/scenario';
import { useSceneList, useSceneOperations } from '@/entities/scene';

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
  const handleSave = async () => {
    await scenarioGraphApi.save();
    alert('シナリオが保存されました');
  };
  return {
    id,
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
    handleSave,
  };
};
