import { SceneEditor } from '@trpg-scenario-maker/ui';
import { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';

export default function Page() {
  const {
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
  } = useScenarioDetailPage();

  if (isLoading) {
    return <div className="p-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">シナリオ編集</h1>
      <SceneEditor
        scenarioId={id}
        scenes={scenes}
        connections={connections}
        onAddScene={handleAddScene}
        onUpdateScene={handleUpdateScene}
        onDeleteScene={handleDeleteScene}
        onAddConnection={handleAddConnection}
        onUpdateConnection={handleUpdateConnection}
        onDeleteConnection={handleDeleteConnection}
      />
    </div>
  );
}
