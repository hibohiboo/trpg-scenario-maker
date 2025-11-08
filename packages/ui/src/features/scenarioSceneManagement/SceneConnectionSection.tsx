import { useState } from 'react';
import { Button } from '../../shared/button';
import type { SceneWithConnection } from './sceneConnectionHelpers';
import type { Scene } from './types';

interface SceneConnectionSectionProps {
  title: string;
  connectedScenes: SceneWithConnection[];
  availableScenes: Scene[];
  onConnectionDelete?: (connectionId: string) => void;
  onConnectionAdd?: (sceneId: string) => void;
  placeholderText: string;
  inputClassName: string;
}

export function SceneConnectionSection({
  title,
  connectedScenes,
  availableScenes,
  onConnectionDelete,
  onConnectionAdd,
  placeholderText,
  inputClassName,
}: SceneConnectionSectionProps) {
  const [resetKey, setResetKey] = useState(0);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sceneId = e.target.value;
    if (sceneId && onConnectionAdd) {
      onConnectionAdd(sceneId);
      // Reset the select by updating the key
      setResetKey((prev) => prev + 1);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      {connectedScenes.length > 0 && (
        <ul className="space-y-2 mb-3">
          {connectedScenes.map(({ connection, scene }) => (
            <li
              key={connection.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
            >
              <span className="text-sm text-gray-900">{scene?.title}</span>
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
      {onConnectionAdd && availableScenes.length > 0 && (
        <select
          key={resetKey}
          onChange={handleSelectChange}
          className={inputClassName}
          defaultValue=""
        >
          <option value="">{placeholderText}</option>
          {availableScenes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
