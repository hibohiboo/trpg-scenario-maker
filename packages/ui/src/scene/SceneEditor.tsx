import { SceneForm } from '../features/scenarioSceneManagement';
import { Button } from '../shared/button';
import { Modal } from '../shared/modal';
import { Tabs } from '../shared/tabs';
import { SceneFlowCanvas } from './SceneFlowCanvas';
import { createEventHandlers } from './sceneEditorHelpers';
import { SceneEventIcon } from './sceneEvent';
import type { Tab } from '..';
import type { SceneEditorProps, Scene } from './types';

const getSceneEvents = ({
  editingScene,
  events,
}: Pick<SceneEditorProps, 'editingScene' | 'events'>) => {
  if (!editingScene || !events) return [];
  return events[editingScene.id] ?? [];
};

const getTitle = ({ editingScene }: Pick<SceneEditorProps, 'editingScene'>) =>
  editingScene ? 'シーンを編集' : '新しいシーンを作成';

const renderSceneList = (
  scenes: Scene[],
  events: SceneEditorProps['events'],
  onEditScene: (scene: Scene) => void,
) => (
  <div className="space-y-2">
    {scenes.map((scene) => {
      const eventsForScene = events?.[scene.id] || [];
      return (
        <div
          key={scene.id}
          className="flex items-center justify-between rounded-md border border-gray-200 p-4"
        >
          <div className="flex-1">
            <h4 className="font-semibold">
              {scene.title}
              {scene.isMasterScene && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                  マスターシーン
                </span>
              )}
            </h4>
            {eventsForScene.length > 0 ? (
              <div className="mt-2 flex gap-2 items-center flex-wrap">
                {eventsForScene.map((event) => (
                  <SceneEventIcon
                    key={event.id}
                    type={event.type}
                    size={16}
                    className="text-gray-600"
                    title={event.content}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-400">イベントなし</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onEditScene(scene)}
              variant="success"
              size="sm"
            >
              編集
            </Button>
          </div>
        </div>
      );
    })}
    {scenes.length === 0 && (
      <p className="text-center text-gray-500">
        シーンがありません。シーンを追加してください。
      </p>
    )}
  </div>
);

const renderSceneFlow = (
  scenes: Scene[],
  connections: SceneEditorProps['connections'],
  events: SceneEditorProps['events'],
  onAddConnection: SceneEditorProps['onAddConnection'],
  onDeleteConnection: SceneEditorProps['onDeleteConnection'],
  informationItems?: SceneEditorProps['informationItems'],
  informationConnections?: SceneEditorProps['informationConnections'],
  informationToSceneConnections?: SceneEditorProps['informationToSceneConnections'],
  sceneInformationConnections?: SceneEditorProps['sceneInformationConnections'],
) => (
  <SceneFlowCanvas
    scenes={scenes}
    connections={connections}
    events={events}
    onConnectionAdd={onAddConnection}
    onConnectionDelete={onDeleteConnection}
    informationItems={informationItems}
    informationConnections={informationConnections}
    informationToSceneConnections={informationToSceneConnections}
    sceneInformationConnections={sceneInformationConnections}
  />
);

export function SceneEditor({
  scenarioId: _scenarioId,
  scenes,
  connections,
  events,
  isFormOpen,
  editingScene,
  onAddScene,
  onUpdateScene,
  onDeleteScene: _onDeleteScene,
  onAddConnection,
  onDeleteConnection,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onMoveEventUp,
  onMoveEventDown,
  onOpenForm,
  onCloseForm,
  onEditScene,
  informationItems,
  informationConnections,
  informationToSceneConnections,
  sceneInformationConnections,
  onAddSceneInformation,
  onRemoveSceneInformation,
}: SceneEditorProps) {
  const handleAddScene = (scene: Omit<Scene, 'id'>) => {
    onAddScene(scene);
    onCloseForm();
  };

  const handleUpdateScene = (scene: Omit<Scene, 'id'>) => {
    if (editingScene) {
      onUpdateScene(editingScene.id, scene);
      onCloseForm();
    }
  };

  const handleDeleteScene = (id: string) => {
    _onDeleteScene(id);
    onCloseForm();
  };

  const sceneEvents = getSceneEvents({ editingScene, events });

  const eventHandlers = createEventHandlers(
    editingScene,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    onMoveEventUp,
    onMoveEventDown,
  );
  const title = getTitle({ editingScene });

  const sceneListContent = (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">シーン一覧</h3>
      {renderSceneList(scenes, events, onEditScene)}
    </div>
  );

  const sceneFlowContent = (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">シーンフロー</h3>
      {renderSceneFlow(
        scenes,
        connections,
        events,
        onAddConnection,
        onDeleteConnection,
        informationItems,
        informationConnections,
        informationToSceneConnections,
        sceneInformationConnections,
      )}
    </div>
  );

  const tabs: Tab[] = [
    {
      id: 'list',
      label: 'シーン一覧',
      content: renderSceneList(scenes, events, onEditScene),
    },
    {
      id: 'flow',
      label: 'シーンフロー',
      content: renderSceneFlow(
        scenes,
        connections,
        events,
        onAddConnection,
        onDeleteConnection,
        informationItems,
        informationConnections,
        informationToSceneConnections,
        sceneInformationConnections,
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">シーン編集</h2>
        <Button onClick={onOpenForm} variant="primary">
          シーンを追加
        </Button>
      </div>

      <Modal isOpen={isFormOpen} onClose={onCloseForm} title={title} size="lg">
        {isFormOpen && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <SceneForm
              scene={editingScene ?? undefined}
              scenes={scenes}
              connections={connections}
              events={sceneEvents}
              onSubmit={editingScene ? handleUpdateScene : handleAddScene}
              onCancel={onCloseForm}
              onDelete={handleDeleteScene}
              onConnectionDelete={onDeleteConnection}
              onConnectionAdd={onAddConnection}
              onEventAdd={eventHandlers.handleAddEvent}
              onEventUpdate={eventHandlers.handleUpdateEvent}
              onEventDelete={eventHandlers.handleDeleteEvent}
              onEventMoveUp={eventHandlers.handleMoveEventUp}
              onEventMoveDown={eventHandlers.handleMoveEventDown}
              informationItems={informationItems}
              sceneInformationConnections={sceneInformationConnections}
              onAddSceneInformation={
                editingScene && onAddSceneInformation
                  ? (informationItemId: string) =>
                      onAddSceneInformation(editingScene.id, informationItemId)
                  : undefined
              }
              onRemoveSceneInformation={onRemoveSceneInformation}
            />
          </div>
        )}
      </Modal>

      {/* PC: 横並び（1:3の割合）、スマホ: タブ切り替え */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-4">
        <div className="md:col-span-1">{sceneListContent}</div>
        <div className="md:col-span-3">{sceneFlowContent}</div>
      </div>

      <div className="md:hidden">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
