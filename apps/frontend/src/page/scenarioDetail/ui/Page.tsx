import {
  SceneEditor,
  ScenarioCharacterList,
  Loading,
  ErrorMessage,
} from '@trpg-scenario-maker/ui';
import { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';

export default function Page() {
  const {
    id,
    scenes,
    connections,
    events,
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
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleMoveEventUp,
    handleMoveEventDown,
    handleOpenForm,
    handleCloseForm,
    handleEditScene,
    characters,
    isCharactersLoading,
    handleCharacterClick,
    handleEditCharacter,
    handleRemoveCharacter,
    handleCreateNewCharacter,
    handleAddExistingCharacter,
  } = useScenarioDetailPage();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} title="シナリオの読み込みエラー" />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">シナリオ編集</h1>

      <section>
        <ScenarioCharacterList
          characters={characters}
          isLoading={isCharactersLoading}
          onCharacterClick={handleCharacterClick}
          onEditCharacter={handleEditCharacter}
          onRemoveCharacter={handleRemoveCharacter}
          onCreateNew={handleCreateNewCharacter}
          onAddExisting={handleAddExistingCharacter}
        />
      </section>

      <section>
        <SceneEditor
          scenarioId={id}
          scenes={scenes}
          connections={connections}
          events={events}
          isFormOpen={isFormOpen}
          editingScene={editingScene}
          onAddScene={handleAddScene}
          onUpdateScene={handleUpdateScene}
          onDeleteScene={handleDeleteScene}
          onAddConnection={handleAddConnection}
          onUpdateConnection={handleUpdateConnection}
          onDeleteConnection={handleDeleteConnection}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          onMoveEventUp={handleMoveEventUp}
          onMoveEventDown={handleMoveEventDown}
          onOpenForm={handleOpenForm}
          onCloseForm={handleCloseForm}
          onEditScene={handleEditScene}
        />
      </section>
    </div>
  );
}
