import type { FormEvent } from 'react';

interface SceneBasicFieldsProps {
  title: string;
  description: string;
  isMasterScene: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onMasterSceneChange: (value: boolean) => void;
  inputClassName: string;
  labelClassName: string;
}

export function SceneBasicFields({
  title,
  description,
  isMasterScene,
  onTitleChange,
  onDescriptionChange,
  onMasterSceneChange,
  inputClassName,
  labelClassName,
}: SceneBasicFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="scene-title" className={labelClassName}>
          シーンタイトル
        </label>
        <input
          id="scene-title"
          type="text"
          value={title}
          onChange={(e: FormEvent<HTMLInputElement>) =>
            onTitleChange(e.currentTarget.value)
          }
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
          onChange={(e: FormEvent<HTMLTextAreaElement>) =>
            onDescriptionChange(e.currentTarget.value)
          }
          rows={4}
          className={inputClassName}
        />
      </div>

      <div className="flex items-center">
        <input
          id="is-master-scene"
          type="checkbox"
          checked={isMasterScene}
          onChange={(e: FormEvent<HTMLInputElement>) =>
            onMasterSceneChange(e.currentTarget.checked)
          }
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor="is-master-scene"
          className="ml-2 block text-sm text-gray-900"
        >
          マスターシーン
        </label>
      </div>
    </>
  );
}
