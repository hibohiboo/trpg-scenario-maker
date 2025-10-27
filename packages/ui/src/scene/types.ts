import type { SceneConnection, Scene } from '@trpg-scenario-maker/schema/scene';

export type { SceneConnection, Scene };

export type SceneEventType =
  | 'start'
  | 'conversation'
  | 'choice'
  | 'battle'
  | 'treasure'
  | 'trap'
  | 'puzzle'
  | 'rest'
  | 'ending';

export interface SceneEvent {
  id: string;
  type: SceneEventType;
  content: string;
  sortOrder: number;
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
