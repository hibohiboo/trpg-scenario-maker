import {
  SceneEditor,
  ScenarioCharacterList,
  ScenarioCharacterRelationshipList,
  ScenarioCharacterRelationshipFormModal,
  ScenarioCharacterFormModal,
  ScenarioCharacterEditModal,
  Loading,
  ErrorMessage,
} from '@trpg-scenario-maker/ui';
import { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';
import { Navigation } from './Navigation';

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
    handleRemoveCharacter,
    isCharacterFormOpen,
    handleOpenCharacterForm,
    handleCloseCharacterForm,
    handleCreateNewCharacter,
    isCharacterEditOpen,
    editingCharacter,
    handleOpenEditCharacter,
    handleCloseEditCharacter,
    handleUpdateCharacter,
    handleAddExistingCharacter,
    characterRelations,
    isRelationsLoading,
    isRelationshipFormOpen,
    handleAddRelationship,
    handleCloseRelationshipForm,
    handleSubmitRelationship,
    handleRemoveRelationship,
    tabItems,
    currentTab,
    handleChangeTab,
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
      <Navigation
        current={currentTab}
        items={tabItems}
        onClick={handleChangeTab}
      />
      {currentTab === 'キャラクター' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-5">
              <ScenarioCharacterList
                characters={characters}
                isLoading={isCharactersLoading}
                onCharacterClick={handleCharacterClick}
                onEditCharacter={handleOpenEditCharacter}
                onRemoveCharacter={handleRemoveCharacter}
                onCreateNew={handleOpenCharacterForm}
                onAddExisting={handleAddExistingCharacter}
              />
            </section>

            <section className="lg:col-span-4">
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
          <ScenarioCharacterEditModal
            isOpen={isCharacterEditOpen}
            character={editingCharacter}
            onClose={handleCloseEditCharacter}
            onSubmit={handleUpdateCharacter}
          />
          <ScenarioCharacterRelationshipFormModal
            isOpen={isRelationshipFormOpen}
            characters={characters}
            onClose={handleCloseRelationshipForm}
            onSubmit={handleSubmitRelationship}
          />
        </>
      )}
      {currentTab === 'シーン' && (
        <>
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
        </>
      )}
    </div>
  );
}
