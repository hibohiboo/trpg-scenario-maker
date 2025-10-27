import { Button, Modal } from '..';
import { createEventHandlers } from './sceneEditorHelpers';
import { SceneFlowCanvas } from './SceneFlowCanvas';
import { SceneForm } from './SceneForm';
import type { SceneEditorProps, Scene } from './types';

const getSceneEvents = ({
  editingScene,
  events,
}: Pick<SceneEditorProps, 'editingScene' | 'events'>) =>
  editingScene && events ? events[editingScene.id] : undefined;

const getTitle = ({ editingScene }: Pick<SceneEditorProps, 'editingScene'>) =>
  editingScene ? 'シーンを編集' : '新しいシーンを作成';

export function SceneEditor({
  scenarioId: _scenarioId,
  scenes,
  connections,
  events,
  isFormOpen,
  editingScene,
  onAddScene,
  onUpdateScene,
  onDeleteScene,
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">シーン編集</h2>
        <Button onClick={onOpenForm} variant="primary">
          シーンを追加
        </Button>
      </div>

      <Modal isOpen={isFormOpen} onClose={onCloseForm} title={title} size="lg">
        {isFormOpen && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>
            <SceneForm
              scene={editingScene ?? undefined}
              scenes={scenes}
              connections={connections}
              events={sceneEvents}
              onSubmit={editingScene ? handleUpdateScene : handleAddScene}
              onCancel={onCloseForm}
              onConnectionDelete={onDeleteConnection}
              onConnectionAdd={onAddConnection}
              onEventAdd={eventHandlers.handleAddEvent}
              onEventUpdate={eventHandlers.handleUpdateEvent}
              onEventDelete={eventHandlers.handleDeleteEvent}
              onEventMoveUp={eventHandlers.handleMoveEventUp}
              onEventMoveDown={eventHandlers.handleMoveEventDown}
            />
          </div>
        )}
      </Modal>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">シーン一覧</h3>
        <div className="space-y-2">
          {scenes.map((scene) => (
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
                <p className="mt-1 text-sm text-gray-600">
                  {scene.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEditScene(scene)}
                  variant="success"
                  size="sm"
                >
                  編集
                </Button>
                <Button
                  onClick={() => onDeleteScene(scene.id)}
                  variant="danger"
                  size="sm"
                >
                  削除
                </Button>
              </div>
            </div>
          ))}
          {scenes.length === 0 && (
            <p className="text-center text-gray-500">
              シーンがありません。シーンを追加してください。
            </p>
          )}
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">シーンフロー</h3>
        <SceneFlowCanvas
          scenes={scenes}
          connections={connections}
          onConnectionAdd={onAddConnection}
          onConnectionDelete={onDeleteConnection}
        />
      </div>
    </div>
  );
}
