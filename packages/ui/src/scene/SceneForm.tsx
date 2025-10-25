import { useState, type FormEvent } from 'react';
import type { Scene } from './types';

interface SceneFormProps {
  scene?: Scene;
  onSubmit: (scene: Omit<Scene, 'id'>) => void;
  onCancel?: () => void;
}

const inputClassName =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500';
const labelClassName = 'block text-sm font-medium text-gray-700';
const buttonClassName =
  'rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
const cancelButtonClassName =
  'rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300';

// eslint-disable-next-line complexity
export function SceneForm({ scene, onSubmit, onCancel }: SceneFormProps) {
  const [title, setTitle] = useState(scene?.title || '');
  const [description, setDescription] = useState(scene?.description || '');
  const [isMasterScene, setIsMasterScene] = useState(
    scene?.isMasterScene || false,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, isMasterScene });
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

      <div className="flex gap-2">
        <button type="submit" className={buttonClassName}>
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={cancelButtonClassName}
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
