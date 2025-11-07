import { SceneConnectionSection } from './SceneConnectionSection';
import type { Scene } from '../types';
import type { SceneWithConnection } from './sceneConnectionHelpers';

interface SceneConnectionsSectionProps {
  nextScenes: SceneWithConnection[];
  previousScenes: SceneWithConnection[];
  availableNextScenes: Scene[];
  availablePreviousScenes: Scene[];
  onConnectionDelete?: (connectionId: string) => void;
  onAddNextScene: (sceneId: string) => void;
  onAddPreviousScene: (sceneId: string) => void;
  inputClassName: string;
}

export function SceneConnectionsSection({
  nextScenes,
  previousScenes,
  availableNextScenes,
  availablePreviousScenes,
  onConnectionDelete,
  onAddNextScene,
  onAddPreviousScene,
  inputClassName,
}: SceneConnectionsSectionProps) {
  return (
    <div className="border-t pt-4 mt-4 space-y-3">
      <SceneConnectionSection
        title="前のシーン"
        connectedScenes={previousScenes}
        availableScenes={availablePreviousScenes}
        onConnectionDelete={onConnectionDelete}
        onConnectionAdd={onAddPreviousScene}
        placeholderText="前のシーンを選択..."
        inputClassName={inputClassName}
      />

      <SceneConnectionSection
        title="次のシーン"
        connectedScenes={nextScenes}
        availableScenes={availableNextScenes}
        onConnectionDelete={onConnectionDelete}
        onConnectionAdd={onAddNextScene}
        placeholderText="次のシーンを選択..."
        inputClassName={inputClassName}
      />
    </div>
  );
}
