import {
  SceneEditor,
  ScenarioCharacterList,
  ScenarioCharacterRelationshipList,
  ScenarioCharacterRelationshipFormModal,
  ScenarioCharacterFormModal,
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
    isCharacterFormOpen,
    handleOpenCharacterForm,
    handleCloseCharacterForm,
    handleCreateNewCharacter,
    handleAddExistingCharacter,
    characterRelations,
    isRelationsLoading,
    isRelationshipFormOpen,
    handleAddRelationship,
    handleCloseRelationshipForm,
    handleSubmitRelationship,
    handleRemoveRelationship,
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5">
          <ScenarioCharacterList
            characters={characters}
            isLoading={isCharactersLoading}
            onCharacterClick={handleCharacterClick}
            onEditCharacter={handleEditCharacter}
            onRemoveCharacter={handleRemoveCharacter}
            onCreateNew={handleOpenCharacterForm}
            onAddExisting={handleAddExistingCharacter}
          />
        </section>

        <section className="lg:col-span-3">
          <ScenarioCharacterRelationshipList
            relations={characterRelations}
            isLoading={isRelationsLoading}
            onAddRelationship={handleAddRelationship}
            onRemoveRelationship={handleRemoveRelationship}
          />
        </section>
      </div>
      <ScenarioCharacterFormModal
        isOpen={isCharacterFormOpen}
        onClose={handleCloseCharacterForm}
        onSubmit={handleCreateNewCharacter}
      />

      <ScenarioCharacterRelationshipFormModal
        isOpen={isRelationshipFormOpen}
        characters={characters}
        onClose={handleCloseRelationshipForm}
        onSubmit={handleSubmitRelationship}
      />

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
