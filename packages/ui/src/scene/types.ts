export interface Scene {
  id: string;
  title: string;
  description: string;
  isMasterScene: boolean;
}

export interface SceneConnection {
  id: string;
  source: string;
  target: string;
}

export interface SceneEditorProps {
  scenarioId: string;
  scenes: Scene[];
  connections: SceneConnection[];
  onAddScene: (scene: Omit<Scene, 'id'>) => void;
  onUpdateScene: (id: string, scene: Partial<Scene>) => void;
  onDeleteScene: (id: string) => void;
  onAddConnection: (connection: Omit<SceneConnection, 'id'>) => void;
  onUpdateConnection: (id: string, connection: Partial<SceneConnection>) => void;
  onDeleteConnection: (id: string) => void;
}
