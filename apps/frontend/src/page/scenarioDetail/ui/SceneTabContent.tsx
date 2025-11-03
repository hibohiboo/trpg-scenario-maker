import { SceneEditor } from '@trpg-scenario-maker/ui';
import type { useScenarioDetailPage } from '../hooks/useScenarioDetailPage';

type SceneTabContentProps = Pick<
  ReturnType<typeof useScenarioDetailPage>,
  | 'id'
  | 'scenes'
  | 'connections'
  | 'events'
  | 'isFormOpen'
  | 'editingScene'
  | 'handleAddScene'
  | 'handleUpdateScene'
  | 'handleDeleteScene'
  | 'handleAddConnection'
  | 'handleUpdateConnection'
  | 'handleDeleteConnection'
  | 'handleAddEvent'
  | 'handleUpdateEvent'
  | 'handleDeleteEvent'
  | 'handleMoveEventUp'
  | 'handleMoveEventDown'
  | 'handleOpenForm'
  | 'handleCloseForm'
  | 'handleEditScene'
  | 'informationItems'
  | 'informationConnections'
  | 'informationToSceneConnections'
  | 'sceneInformationConnections'
  | 'handleAddSceneInformation'
  | 'handleRemoveSceneInformation'
>;

export function SceneTabContent({
  id,
  scenes,
  connections,
  events,
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
  informationItems,
  informationConnections,
  informationToSceneConnections,
  sceneInformationConnections,
  handleAddSceneInformation,
  handleRemoveSceneInformation,
}: SceneTabContentProps) {
  return (
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
        informationItems={informationItems}
        informationConnections={informationConnections}
        informationToSceneConnections={informationToSceneConnections}
        sceneInformationConnections={sceneInformationConnections}
        onAddSceneInformation={handleAddSceneInformation}
        onRemoveSceneInformation={handleRemoveSceneInformation}
      />
    </section>
  );
}
