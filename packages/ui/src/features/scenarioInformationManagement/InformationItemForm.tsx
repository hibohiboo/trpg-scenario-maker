/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import type { InformationItem, InformationToSceneConnection } from './types';
import type { Scene } from '../scene/types';

export interface InformationItemFormProps {
  /** 編集対象の情報項目（新規作成時はundefined） */
  item?: InformationItem;
  /** 送信時のコールバック */
  onSubmit: (data: { title: string; description: string }) => void;
  /** キャンセル時のコールバック */
  onCancel?: () => void;
  /** 削除時のコールバック */
  onDelete?: (id: string) => void;
  /** シーン一覧（指し示すシーン選択用） */
  scenes?: Scene[];
  /** 情報項目→シーン関連一覧 */
  informationToSceneConnections?: InformationToSceneConnection[];
  /** 指し示すシーン追加時のコールバック */
  onAddSceneConnection?: (sceneId: string) => void;
  /** 指し示すシーン削除時のコールバック */
  onRemoveSceneConnection?: (connectionId: string) => void;
}

const inputClassName =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500';
const labelClassName = 'block text-sm font-medium text-gray-700';

const useInformationItemForm = ({
  item,
  onSubmit,
  scenes = [],
  informationToSceneConnections = [],
  onAddSceneConnection,
}: InformationItemFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description });
  };

  const submitLabel = item ? '更新' : '作成';

  // 編集中の情報項目が指し示すシーンのリスト
  const connectedScenes = item
    ? informationToSceneConnections
        .filter((conn) => conn.informationItemId === item.id)
        .map((conn) => {
          const scene = scenes.find((s) => s.id === conn.sceneId);
          return { connection: conn, scene };
        })
        .filter((i) => i.scene !== undefined)
    : [];

  const handleSceneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sceneId = e.target.value;
    if (sceneId && onAddSceneConnection) {
      onAddSceneConnection(sceneId);
    }
  };
  return {
    handleSubmit,
    handleSceneSelect,
    connectedScenes,
    submitLabel,
    title,
    description,
    setTitle,
    scenes,
    setDescription,
  };
};

/**
 * 情報項目作成・編集フォームコンポーネント
 */
export function InformationItemForm(props: InformationItemFormProps) {
  const {
    item,
    onCancel,
    onDelete,
    onAddSceneConnection,
    onRemoveSceneConnection,
  } = props;
  const {
    handleSubmit,
    title,
    setTitle,
    scenes,
    description,
    setDescription,
    connectedScenes,
    handleSceneSelect,
    submitLabel,
  } = useInformationItemForm(props);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className={labelClassName}>
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          説明
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClassName}
          rows={4}
        />
      </div>

      {/* 指し示すシーンセクション（編集時のみ表示） */}
      {item && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">指し示すシーン</h3>

          {/* 既存の関連一覧 */}
          {connectedScenes.length > 0 ? (
            <div className="space-y-2 mb-4">
              {connectedScenes.map(({ connection, scene }) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-3 border border-gray-300 rounded-lg information-to-scene-connection-item"
                >
                  <span className="font-semibold">{scene?.title}</span>
                  {onRemoveSceneConnection && (
                    <Button
                      type="button"
                      onClick={() => onRemoveSceneConnection(connection.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      削除
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">
              指し示すシーンが設定されていません
            </p>
          )}

          {/* シーン追加フォーム */}
          {onAddSceneConnection && scenes.length > 0 && (
            <div>
              <select
                value=""
                onChange={handleSceneSelect}
                className={inputClassName}
              >
                <option value="">シーンを選択</option>
                {scenes.map((scene) => (
                  <option key={scene.id} value={scene.id}>
                    {scene.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 items-center">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {
          <Button type="button" onClick={onCancel} variant="secondary">
            キャンセル
          </Button>
        }
        <div className="flex-1" />
        {item && onDelete && (
          <Button
            type="button"
            onClick={() => onDelete(item.id)}
            variant="danger"
          >
            削除
          </Button>
        )}
      </div>
    </form>
  );
}
