import { Button, Modal } from '..';
import { SceneFlowCanvas } from './SceneFlowCanvas';
import { SceneForm } from './SceneForm';
import type { SceneEditorProps, Scene } from './types';

export function SceneEditor({
  scenarioId: _scenarioId,
  scenes,
  connections,
  isFormOpen,
  editingScene,
  onAddScene,
  onUpdateScene,
  onDeleteScene,
  onAddConnection,
  onDeleteConnection,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">シーン編集</h2>
        <Button onClick={onOpenForm} variant="primary">
          シーンを追加
        </Button>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={onCloseForm}
        title={editingScene ? 'シーンを編集' : '新しいシーンを作成'}
        size="md"
      >
        {isFormOpen && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              {editingScene ? 'シーンを編集' : '新しいシーンを作成'}
            </h3>
            <SceneForm
              scene={editingScene ?? undefined}
              scenes={scenes}
              connections={connections}
              onSubmit={editingScene ? handleUpdateScene : handleAddScene}
              onCancel={onCloseForm}
              onConnectionDelete={onDeleteConnection}
              onConnectionAdd={onAddConnection}
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
