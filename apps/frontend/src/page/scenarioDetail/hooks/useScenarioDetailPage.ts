import { useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { scenarioGraphApi } from '@/entities/scenario';
import { useSceneEditor } from '@/entities/scene';

export const useScenarioDetailPage = () => {
  const { id } = useParams();
  const data = useLoaderData();
  console.log('Loader data:', data);
  useEffect(() => {
    scenarioGraphApi.create(data);
  }, [id]);
  if (!id) {
    throw new Error('シナリオIDが見つかりません');
  }
  const editor = useSceneEditor(id);

  return { ...editor, id };
};
