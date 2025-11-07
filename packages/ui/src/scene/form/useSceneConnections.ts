import {
  getNextScenes,
  getPreviousScenes,
  getAvailableNextScenes,
  getAvailablePreviousScenes,
} from './sceneConnectionHelpers';
import type { Scene, SceneConnection } from '../types';

interface UseSceneConnectionsParams {
  scene?: Scene;
  scenes: Scene[];
  connections: SceneConnection[];
  onConnectionAdd?: (connection: Omit<SceneConnection, 'id'>) => void;
}

export function useSceneConnections({
  scene,
  scenes,
  connections,
  onConnectionAdd,
}: UseSceneConnectionsParams) {
  if (!scene) {
    return {
      nextScenes: [],
      previousScenes: [],
      availableNextScenes: [],
      availablePreviousScenes: [],
      handleAddNextScene: () => {},
      handleAddPreviousScene: () => {},
    };
  }

  const nextScenes = getNextScenes(scene.id, scenes, connections);
  const previousScenes = getPreviousScenes(scene.id, scenes, connections);
  const availableNextScenes = getAvailableNextScenes(
    scene,
    scenes,
    nextScenes,
    previousScenes,
  );
  const availablePreviousScenes = getAvailablePreviousScenes(
    scene,
    scenes,
    nextScenes,
    previousScenes,
  );

  const handleAddNextScene = (sceneId: string) => {
    if (onConnectionAdd) {
      onConnectionAdd({ source: scene.id, target: sceneId });
    }
  };

  const handleAddPreviousScene = (sceneId: string) => {
    if (onConnectionAdd) {
      onConnectionAdd({ source: sceneId, target: scene.id });
    }
  };

  return {
    nextScenes,
    previousScenes,
    availableNextScenes,
    availablePreviousScenes,
    handleAddNextScene,
    handleAddPreviousScene,
  };
}
