import { useState, type FormEvent } from 'react';
import { Button } from '../common';
import type { Scene, SceneConnection } from './types';

interface SceneFormProps {
  scene?: Scene;
  scenes?: Scene[];
  connections?: SceneConnection[];
  onSubmit: (scene: Omit<Scene, 'id'>) => void;
  onCancel?: () => void;
  onConnectionDelete?: (connectionId: string) => void;
  onConnectionAdd?: (connection: Omit<SceneConnection, 'id'>) => void;
}

const inputClassName =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500';
const labelClassName = 'block text-sm font-medium text-gray-700';

// eslint-disable-next-line complexity
export function SceneForm({
  scene,
  scenes = [],
  connections = [],
  onSubmit,
  onCancel,
  onConnectionDelete,
  onConnectionAdd,
}: SceneFormProps) {
  const [title, setTitle] = useState(scene?.title || '');
  const [description, setDescription] = useState(scene?.description || '');
  const [isMasterScene, setIsMasterScene] = useState(
    scene?.isMasterScene || false,
  );
  const [selectedNextSceneId, setSelectedNextSceneId] = useState('');
  const [selectedPreviousSceneId, setSelectedPreviousSceneId] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, isMasterScene });
  };

  // 現在のシーンに関連する接続を取得
  const nextScenes = scene
    ? connections
        .filter((conn) => conn.source === scene.id)
        .map((conn) => ({
          connection: conn,
          scene: scenes.find((s) => s.id === conn.target),
        }))
        .filter((item) => item.scene !== undefined)
    : [];

  const previousScenes = scene
    ? connections
        .filter((conn) => conn.target === scene.id)
        .map((conn) => ({
          connection: conn,
          scene: scenes.find((s) => s.id === conn.source),
        }))
        .filter((item) => item.scene !== undefined)
    : [];

  // 選択可能な次のシーン（現在のシーン、既に接続済みのシーンを除外）
  const availableNextScenes = scene
    ? scenes.filter(
        (s) =>
          s.id !== scene.id &&
          !nextScenes.some((ns) => ns.scene?.id === s.id),
      )
    : [];

  // 選択可能な前のシーン（現在のシーン、既に接続済みのシーンを除外）
  const availablePreviousScenes = scene
    ? scenes.filter(
        (s) =>
          s.id !== scene.id &&
          !previousScenes.some((ps) => ps.scene?.id === s.id),
      )
    : [];

  const handleAddNextScene = () => {
    if (selectedNextSceneId && scene && onConnectionAdd) {
      onConnectionAdd({ source: scene.id, target: selectedNextSceneId });
      setSelectedNextSceneId('');
    }
  };

  const handleAddPreviousScene = () => {
    if (selectedPreviousSceneId && scene && onConnectionAdd) {
      onConnectionAdd({ source: selectedPreviousSceneId, target: scene.id });
      setSelectedPreviousSceneId('');
    }
  };

  const submitLabel = scene ? '更新' : '作成';
  const titleChangeHandler = (e: FormEvent<HTMLInputElement>) =>
    setTitle(e.currentTarget.value);
  const descChangeHandler = (e: FormEvent<HTMLTextAreaElement>) =>
    setDescription(e.currentTarget.value);
  const masterChangeHandler = (e: FormEvent<HTMLInputElement>) =>
    setIsMasterScene(e.currentTarget.checked);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="scene-title" className={labelClassName}>
          シーンタイトル
        </label>
        <input
          id="scene-title"
          type="text"
          value={title}
          onChange={titleChangeHandler}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="scene-description" className={labelClassName}>
          説明
        </label>
        <textarea
          id="scene-description"
          value={description}
          onChange={descChangeHandler}
          rows={4}
          className={inputClassName}
        />
      </div>

      <div className="flex items-center">
        <input
          id="is-master-scene"
          type="checkbox"
          checked={isMasterScene}
          onChange={masterChangeHandler}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor="is-master-scene"
          className="ml-2 block text-sm text-gray-900"
        >
          マスターシーン
        </label>
      </div>

      {scene && (
        <div className="border-t pt-4 mt-4 space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              前のシーン
            </h3>
            {previousScenes.length > 0 && (
              <ul className="space-y-2 mb-3">
                {previousScenes.map(({ connection, scene: prevScene }) => (
                  <li
                    key={connection.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <span className="text-sm text-gray-900">
                      {prevScene?.title}
                    </span>
                    {onConnectionDelete && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => onConnectionDelete(connection.id)}
                      >
                        削除
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {onConnectionAdd && availablePreviousScenes.length > 0 && (
              <div className="flex gap-2">
                <select
                  value={selectedPreviousSceneId}
                  onChange={(e) => setSelectedPreviousSceneId(e.target.value)}
                  className={inputClassName}
                >
                  <option value="">前のシーンを選択...</option>
                  {availablePreviousScenes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={handleAddPreviousScene}
                  disabled={!selectedPreviousSceneId}
                >
                  追加
                </Button>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              次のシーン
            </h3>
            {nextScenes.length > 0 && (
              <ul className="space-y-2 mb-3">
                {nextScenes.map(({ connection, scene: nextScene }) => (
                  <li
                    key={connection.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <span className="text-sm text-gray-900">
                      {nextScene?.title}
                    </span>
                    {onConnectionDelete && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => onConnectionDelete(connection.id)}
                      >
                        削除
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {onConnectionAdd && availableNextScenes.length > 0 && (
              <div className="flex gap-2">
                <select
                  value={selectedNextSceneId}
                  onChange={(e) => setSelectedNextSceneId(e.target.value)}
                  className={inputClassName}
                >
                  <option value="">次のシーンを選択...</option>
                  {availableNextScenes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={handleAddNextScene}
                  disabled={!selectedNextSceneId}
                >
                  追加
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
