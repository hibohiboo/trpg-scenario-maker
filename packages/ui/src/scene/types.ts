import type { SceneConnection } from '@trpg-scenario-maker/schema/scene';

export type { SceneConnection };

export interface Scene {
  id: string;
  title: string;
  description: string;
  isMasterScene: boolean;
}

export interface SceneEditorProps {
  scenarioId: string;
  scenes: Scene[];
  connections: SceneConnection[];
  isFormOpen: boolean;
  editingScene: Scene | null;
  onAddScene: (scene: Omit<Scene, 'id'>) => void;
  onUpdateScene: (id: string, scene: Partial<Scene>) => void;
  onDeleteScene: (id: string) => void;
  onAddConnection: (connection: Omit<SceneConnection, 'id'>) => void;
  onUpdateConnection: (
    id: string,
    connection: Partial<SceneConnection>,
  ) => void;
  onDeleteConnection: (id: string) => void;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onEditScene: (scene: Scene) => void;
}
