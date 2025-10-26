import {
  SceneEditor,
  Button,
  Loading,
  ErrorMessage,
} from '@trpg-scenario-maker/ui';
import { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';

export default function Page() {
  const {
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
  } = useScenarioDetailPage();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} title="シナリオの読み込みエラー" />;
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">シナリオ編集</h1>
      <Button onClick={handleSave} variant="secondary" className="mb-4">
        保存
      </Button>
      <SceneEditor
        scenarioId={id}
        scenes={scenes}
        connections={connections}
        isFormOpen={isFormOpen}
        editingScene={editingScene}
        onAddScene={handleAddScene}
        onUpdateScene={handleUpdateScene}
        onDeleteScene={handleDeleteScene}
        onAddConnection={handleAddConnection}
        onUpdateConnection={handleUpdateConnection}
        onDeleteConnection={handleDeleteConnection}
        onOpenForm={handleOpenForm}
        onCloseForm={handleCloseForm}
        onEditScene={handleEditScene}
      />
    </>
  );
}
