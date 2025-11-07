import { SceneEditor } from '@trpg-scenario-maker/ui';
import { useInformationItemList } from '@/entities/informationItem';
import { useSceneManagement } from '../hooks/useSceneManagement';

interface SceneTabContentProps {
  scenarioId: string;
  onAddSceneInformation: (sceneId: string, informationItemId: string) => void;
  onRemoveSceneInformation: (connectionId: string) => void;
}

/**
 * シーンタブコンテンツ
 *
 * シーンの作成・編集・削除、シーン間の接続、イベント管理を行う
 */
export function SceneTabContent({
  scenarioId,
  onAddSceneInformation,
  onRemoveSceneInformation,
}: SceneTabContentProps) {
  // シーン管理機能
  const {
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
  } = useSceneManagement();

  // 情報項目データの取得（シーンとの関連表示に使用）
  const {
    items: informationItems,
    informationConnections,
    informationToSceneConnections,
    sceneInformationConnections,
  } = useInformationItemList();

  return (
    <section>
      <SceneEditor
        scenarioId={scenarioId}
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
        onAddSceneInformation={onAddSceneInformation}
        onRemoveSceneInformation={onRemoveSceneInformation}
      />
    </section>
  );
}
