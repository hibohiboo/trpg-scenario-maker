import { Loading, ErrorMessage } from '@trpg-scenario-maker/ui';
import { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';
import { CharacterTabContent } from './CharacterTabContent';
import { InformationItemTabContent } from './InformationItemTabContent';
import { Navigation } from './Navigation';
import { SceneTabContent } from './SceneTabContent';

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
    informationItems,
    informationConnections,
    informationToSceneConnections,
    isInformationItemsLoading,
    isInformationItemFormOpen,
    editingInformationItem,
    handleOpenInformationItemForm,
    handleCloseInformationItemForm,
    handleCreateInformationItem,
    handleUpdateInformationItem,
    handleDeleteInformationItem,
    handleEditInformationItem,
    isInformationConnectionModalOpen,
    handleOpenInformationConnectionModal,
    handleCloseInformationConnectionModal,
    handleCreateInformationConnection,
    handleRemoveInformationConnection,
    handleAddInformationToScene,
    handleRemoveInformationToScene,
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
        <CharacterTabContent
          characters={characters}
          isCharactersLoading={isCharactersLoading}
          handleCharacterClick={handleCharacterClick}
          handleRemoveCharacter={handleRemoveCharacter}
          isCharacterFormOpen={isCharacterFormOpen}
          handleOpenCharacterForm={handleOpenCharacterForm}
          handleCloseCharacterForm={handleCloseCharacterForm}
          handleCreateNewCharacter={handleCreateNewCharacter}
          isCharacterEditOpen={isCharacterEditOpen}
          editingCharacter={editingCharacter}
          handleOpenEditCharacter={handleOpenEditCharacter}
          handleCloseEditCharacter={handleCloseEditCharacter}
          handleUpdateCharacter={handleUpdateCharacter}
          handleAddExistingCharacter={handleAddExistingCharacter}
          characterRelations={characterRelations}
          isRelationsLoading={isRelationsLoading}
          isRelationshipFormOpen={isRelationshipFormOpen}
          handleAddRelationship={handleAddRelationship}
          handleCloseRelationshipForm={handleCloseRelationshipForm}
          handleSubmitRelationship={handleSubmitRelationship}
          handleRemoveRelationship={handleRemoveRelationship}
        />
      )}
      {currentTab === 'シーン' && (
        <SceneTabContent
          id={id}
          scenes={scenes}
          connections={connections}
          events={events}
          isFormOpen={isFormOpen}
          editingScene={editingScene}
          handleAddScene={handleAddScene}
          handleUpdateScene={handleUpdateScene}
          handleDeleteScene={handleDeleteScene}
          handleAddConnection={handleAddConnection}
          handleUpdateConnection={handleUpdateConnection}
          handleDeleteConnection={handleDeleteConnection}
          handleAddEvent={handleAddEvent}
          handleUpdateEvent={handleUpdateEvent}
          handleDeleteEvent={handleDeleteEvent}
          handleMoveEventUp={handleMoveEventUp}
          handleMoveEventDown={handleMoveEventDown}
          handleOpenForm={handleOpenForm}
          handleCloseForm={handleCloseForm}
          handleEditScene={handleEditScene}
          informationItems={informationItems}
          informationConnections={informationConnections}
          informationToSceneConnections={informationToSceneConnections}
        />
      )}
      {currentTab === '情報項目' && (
        <InformationItemTabContent
          informationItems={informationItems}
          informationConnections={informationConnections}
          informationToSceneConnections={informationToSceneConnections}
          scenes={scenes}
          isInformationItemsLoading={isInformationItemsLoading}
          isInformationItemFormOpen={isInformationItemFormOpen}
          editingInformationItem={editingInformationItem}
          handleOpenInformationItemForm={handleOpenInformationItemForm}
          handleCloseInformationItemForm={handleCloseInformationItemForm}
          handleCreateInformationItem={handleCreateInformationItem}
          handleUpdateInformationItem={handleUpdateInformationItem}
          handleDeleteInformationItem={handleDeleteInformationItem}
          handleEditInformationItem={handleEditInformationItem}
          isInformationConnectionModalOpen={isInformationConnectionModalOpen}
          handleOpenInformationConnectionModal={handleOpenInformationConnectionModal}
          handleCloseInformationConnectionModal={handleCloseInformationConnectionModal}
          handleCreateInformationConnection={handleCreateInformationConnection}
          handleRemoveInformationConnection={handleRemoveInformationConnection}
          handleAddInformationToScene={handleAddInformationToScene}
          handleRemoveInformationToScene={handleRemoveInformationToScene}
        />
      )}
    </div>
  );
}
